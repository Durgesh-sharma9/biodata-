import Candidate from '../models/Candidate.js';
import School from '../models/School.js';
import UnlockHistory from '../models/UnlockHistory.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TEACHING_POSITIONS, UNLOCK_CREDIT_COST } from '../config/constants.js';
import {
  formatCandidateForSchool,
  isOwnedBySchool,
  hasFullAccess,
} from '../utils/candidateAccess.js';
import { resolveLocationFromLocalityId } from '../utils/locationHelper.js';

const buildCandidateFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.name) {
    filter.fullName = { $regex: query.name, $options: 'i' };
  }
  if (query.mobile) {
    filter.mobile = { $regex: query.mobile, $options: 'i' };
  }
  if (query.position) {
    filter.position = query.position;
  }
  if (query.subject) {
    filter.subjects = query.subject;
  }
  if (query.qualification) {
    filter.qualifications = query.qualification;
  }
  if (query.class) {
    filter.classesCanTeach = query.class;
  }
  if (query.experience) {
    const exp = Number(query.experience);
    if (!Number.isNaN(exp)) {
      filter.experienceYears = exp;
    }
  }
  if (query.state) filter.state = query.state;
  if (query.city) filter.city = query.city;
  if (query.locality) filter.locality = query.locality;
  if (query.source) filter.source = query.source;
  if (query.expectedSalaryMin) {
    filter.expectedSalary = { ...filter.expectedSalary, $gte: Number(query.expectedSalaryMin) };
  }
  if (query.expectedSalaryMax) {
    filter.expectedSalary = { ...filter.expectedSalary, $lte: Number(query.expectedSalaryMax) };
  }
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) {
      const end = new Date(query.dateTo);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  return filter;
};

const getSortOption = (sortBy, sortOrder) => {
  const allowed = ['fullName', 'mobile', 'position', 'experienceYears', 'expectedSalary', 'createdAt', 'source'];
  const field = allowed.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  return { [field]: order };
};

const applySectionFilter = (filter, section, schoolId) => {
  if (!section || !schoolId) return filter;

  if (section === 'my_candidates') {
    filter.ownerSchoolId = schoolId;
    filter.source = { $in: ['ADMIN', 'SCHOOL_LINK'] };
  } else if (section === 'talent_pool') {
    filter.$or = [
      { source: { $in: ['SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'] } },
      {
        $and: [
          { ownerSchoolId: { $exists: true, $ne: null } },
          { ownerSchoolId: { $ne: schoolId } },
        ],
      },
    ];
  }

  return filter;
};

export const getCandidates = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    section,
    ...filters
  } = req.query;

  const filter = applySectionFilter(buildCandidateFilter(filters), section, req.schoolId);
  const skip = (Number(page) - 1) * Number(limit);
  const sort = getSortOption(sortBy, sortOrder);

  const [candidates, total] = await Promise.all([
    Candidate.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Candidate.countDocuments(filter),
  ]);

  const formatted = await Promise.all(
    candidates.map((c) => formatCandidateForSchool(c, req.schoolId))
  );

  res.json({
    success: true,
    data: formatted,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getCandidate = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  const formatted = await formatCandidateForSchool(candidate, req.schoolId);
  res.json({ success: true, data: formatted });
});

export const unlockCandidate = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  if (isOwnedBySchool(candidate, req.schoolId)) {
    return res.json({
      success: true,
      message: 'You already have full access to this candidate',
      data: await formatCandidateForSchool(candidate, req.schoolId),
    });
  }

  const alreadyUnlocked = await hasFullAccess(candidate, req.schoolId);
  if (alreadyUnlocked) {
    return res.json({
      success: true,
      message: 'Candidate already unlocked',
      data: await formatCandidateForSchool(candidate, req.schoolId),
    });
  }

  const school = await School.findById(req.schoolId);
  if (!school || (school.credits || 0) < UNLOCK_CREDIT_COST) {
    throw new ApiError(402, 'Insufficient credits. Please purchase more credits.');
  }

  school.credits -= UNLOCK_CREDIT_COST;
  await school.save();

  await UnlockHistory.create({
    schoolId: req.schoolId,
    candidateId: candidate._id,
    creditsDeducted: UNLOCK_CREDIT_COST,
  });

  const formatted = await formatCandidateForSchool(candidate, req.schoolId);
  res.json({
    success: true,
    message: 'Profile unlocked successfully',
    data: formatted,
    creditsRemaining: school.credits,
  });
});

export const checkDuplicate = catchAsync(async (req, res) => {
  const { mobile } = req.query;
  if (!mobile) throw new ApiError(400, 'Mobile number is required');

  const filter = {
    ownerSchoolId: req.schoolId,
    mobile: mobile.trim(),
    isDeleted: false,
  };

  if (req.query.excludeId) {
    filter._id = { $ne: req.query.excludeId };
  }

  const existing = await Candidate.findOne(filter);

  res.json({
    success: true,
    duplicate: !!existing,
    data: existing,
  });
});

export const createCandidate = catchAsync(async (req, res) => {
  const { fullName, mobile, forceCreate, localityId } = req.body;

  if (!fullName || !mobile) {
    throw new ApiError(400, 'Full name and mobile are required');
  }

  if (!forceCreate) {
    const existing = await Candidate.findOne({
      ownerSchoolId: req.schoolId,
      mobile: mobile.trim(),
      isDeleted: false,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Candidate with this mobile number already exists',
        duplicate: true,
        data: existing,
      });
    }
  }

  let locationFields = {};
  if (localityId) {
    locationFields = await resolveLocationFromLocalityId(localityId);
  }

  const candidate = await Candidate.create({
    ...req.body,
    ...locationFields,
    schoolId: req.schoolId,
    ownerSchoolId: req.schoolId,
    source: 'ADMIN',
    mobile: mobile.trim(),
  });

  res.status(201).json({ success: true, data: candidate });
});

export const updateCandidate = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  if (!isOwnedBySchool(candidate, req.schoolId)) {
    throw new ApiError(403, 'You can only edit candidates owned by your school');
  }

  if (req.body.mobile && req.body.mobile !== candidate.mobile) {
    const duplicate = await Candidate.findOne({
      ownerSchoolId: req.schoolId,
      mobile: req.body.mobile.trim(),
      isDeleted: false,
      _id: { $ne: candidate._id },
    });

    if (duplicate) {
      throw new ApiError(409, 'Another candidate with this mobile number exists');
    }
  }

  if (req.body.localityId) {
    const locationFields = await resolveLocationFromLocalityId(req.body.localityId);
    candidate.state = locationFields.state;
    candidate.city = locationFields.city;
    candidate.locality = locationFields.locality;
  }

  const { localityId, ...updateData } = req.body;
  Object.assign(candidate, updateData);
  if (req.body.mobile) candidate.mobile = req.body.mobile.trim();
  await candidate.save();

  res.json({ success: true, data: candidate });
});

export const deleteCandidate = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  if (!isOwnedBySchool(candidate, req.schoolId)) {
    throw new ApiError(403, 'You can only delete candidates owned by your school');
  }

  candidate.isDeleted = true;
  await candidate.save();

  res.json({ success: true, message: 'Candidate deleted successfully' });
});

export const getDashboardStats = catchAsync(async (req, res) => {
  const schoolId = req.schoolId;
  const school = await School.findById(schoolId);

  const baseFilter = { isDeleted: false };
  const ownedFilter = { ...baseFilter, ownerSchoolId: schoolId };

  const myCandidatesFilter = {
    ...baseFilter,
    ownerSchoolId: schoolId,
    source: { $in: ['ADMIN', 'SCHOOL_LINK'] },
  };
  const talentPoolFilter = {
    ...baseFilter,
    $or: [
      { source: { $in: ['SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'] } },
      {
        $and: [
          { ownerSchoolId: { $exists: true, $ne: null } },
          { ownerSchoolId: { $ne: schoolId } },
        ],
      },
    ],
  };

  const [myCandidates, talentPoolCount, ownedCandidates, recentCandidates] = await Promise.all([
    Candidate.countDocuments(myCandidatesFilter),
    Candidate.countDocuments(talentPoolFilter),
    Candidate.countDocuments(ownedFilter),
    Candidate.find(myCandidatesFilter).sort({ createdAt: -1 }).limit(5),
  ]);

  const formattedRecent = await Promise.all(
    recentCandidates.map((c) => formatCandidateForSchool(c, schoolId))
  );

  res.json({
    success: true,
    data: {
      myCandidates,
      talentPoolCount,
      totalCandidates: myCandidates + talentPoolCount,
      ownedCandidates,
      availableCredits: school?.credits || 0,
      recentCandidates: formattedRecent,
    },
  });
});
