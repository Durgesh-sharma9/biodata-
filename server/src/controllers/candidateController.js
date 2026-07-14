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
import { buildLocationPayload, syncCandidateLocation, calculateDistanceKm } from '../utils/location.js';

const buildCandidateFilter = (query) => {
  const conditions = [{ isDeleted: false }];

  if (query.name) {
    conditions.push({
      $or: [
        { fullName: { $regex: query.name, $options: 'i' } },
        { mobile: { $regex: query.name, $options: 'i' } },
        { position: { $regex: query.name, $options: 'i' } },
        { state: { $regex: query.name, $options: 'i' } },
        { city: { $regex: query.name, $options: 'i' } },
        { area: { $regex: query.name, $options: 'i' } },
        { address: { $regex: query.name, $options: 'i' } },
      ],
    });
  }
  if (query.mobile) {
    conditions.push({ mobile: { $regex: query.mobile, $options: 'i' } });
  }
  if (query.position) {
    conditions.push({ position: query.position });
  }
  if (query.subject) {
    conditions.push({ subjects: query.subject });
  }
  if (query.qualification) {
    conditions.push({ qualifications: query.qualification });
  }
  if (query.class) {
    conditions.push({ classesCanTeach: query.class });
  }
  if (query.experience) {
    const exp = Number(query.experience);
    if (!Number.isNaN(exp)) {
      conditions.push({ experienceYears: exp });
    }
  }
  if (query.state) conditions.push({ state: { $regex: query.state, $options: 'i' } });
  if (query.city) conditions.push({ city: { $regex: query.city, $options: 'i' } });
  if (query.area) {
    conditions.push({
      $or: [
        { area: { $regex: query.area, $options: 'i' } },
        { address: { $regex: query.area, $options: 'i' } },
      ],
    });
  }
  if (query.source) conditions.push({ source: query.source });
  if (query.expectedSalaryMin || query.expectedSalaryMax) {
    const expectedSalary = {};
    if (query.expectedSalaryMin) expectedSalary.$gte = Number(query.expectedSalaryMin);
    if (query.expectedSalaryMax) expectedSalary.$lte = Number(query.expectedSalaryMax);
    conditions.push({ expectedSalary });
  }
  if (query.dateFrom || query.dateTo) {
    const createdAt = {};
    if (query.dateFrom) createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) {
      const end = new Date(query.dateTo);
      end.setHours(23, 59, 59, 999);
      createdAt.$lte = end;
    }
    conditions.push({ createdAt });
  }

  return conditions.length > 1 ? { $and: conditions } : { isDeleted: false };
};

const getSortOption = (sortBy, sortOrder) => {
  const allowed = ['fullName', 'mobile', 'position', 'experienceYears', 'expectedSalary', 'createdAt', 'source'];
  const field = allowed.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  return { [field]: order };
};

const applySectionFilter = (filter, section, schoolId) => {
  if (!section || !schoolId) return filter;

  const sectionConditions = [];

  if (section === 'my_candidates') {
    sectionConditions.push({ ownerSchoolId: schoolId });
    sectionConditions.push({ source: { $in: ['ADMIN', 'SCHOOL_LINK'] } });
  } else if (section === 'talent_pool') {
    sectionConditions.push({
      $or: [
        { source: { $in: ['SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'] } },
        {
          $and: [
            { ownerSchoolId: { $exists: true, $ne: null } },
            { ownerSchoolId: { $ne: schoolId } },
          ],
        },
      ],
    });
  }

  if (!sectionConditions.length) return filter;

  if (filter.$and) {
    return { ...filter, $and: [...filter.$and, ...sectionConditions] };
  }

  return { $and: [{ isDeleted: false }, ...sectionConditions] };
};

export const getCandidates = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    section,
    nearby,
    radiusKm,
    ...filters
  } = req.query;

  const filter = applySectionFilter(buildCandidateFilter(filters), section, req.schoolId);
  const sort = getSortOption(sortBy, sortOrder);
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const nearbyEnabled = nearby === 'true' || nearby === true;
  const radiusLimit = Number(radiusKm) || 50;

  const school = req.schoolId ? await School.findById(req.schoolId) : null;
  const referenceLocation = nearbyEnabled && school?.latitude && school?.longitude
    ? { latitude: Number(school.latitude), longitude: Number(school.longitude) }
    : null;

  const allCandidates = await Candidate.find(filter).sort(sort);
  let candidates = allCandidates;
  let total = allCandidates.length;

  if (referenceLocation) {
    candidates = allCandidates
      .map((candidate) => {
        const distanceKm = calculateDistanceKm(
          referenceLocation.latitude,
          referenceLocation.longitude,
          candidate.latitude,
          candidate.longitude
        );
        return { candidate, distanceKm };
      })
      .filter(({ distanceKm }) => distanceKm === null || distanceKm <= radiusLimit)
      .sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });

    total = candidates.length;
    candidates = candidates.slice(skip, skip + limitNumber).map(({ candidate }) => candidate);
  } else {
    candidates = allCandidates.slice(skip, skip + limitNumber);
  }

  const formatted = await Promise.all(
    candidates.map(async (c) => {
      const candidateObject = c.toObject ? c.toObject() : { ...c };
      if (referenceLocation) {
        const distanceKm = calculateDistanceKm(
          referenceLocation.latitude,
          referenceLocation.longitude,
          candidateObject.latitude,
          candidateObject.longitude
        );
        candidateObject.distanceKm = distanceKm;
        candidateObject.schoolLatitude = referenceLocation.latitude;
        candidateObject.schoolLongitude = referenceLocation.longitude;
      }
      return formatCandidateForSchool(candidateObject, req.schoolId);
    })
  );

  res.json({
    success: true,
    data: formatted,
    schoolLocation: school?.latitude && school?.longitude ? {
      latitude: school.latitude,
      longitude: school.longitude,
      workingRadius: school.workingRadius,
    } : null,
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
  const { fullName, mobile, forceCreate } = req.body;

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

  const locationPayload = await buildLocationPayload(req.body);

  const candidate = await Candidate.create({
    ...req.body,
    ...locationPayload,
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

  const { ...updateData } = req.body;
  Object.assign(candidate, updateData);
  await syncCandidateLocation(candidate, req.body);
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
