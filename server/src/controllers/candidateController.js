import Candidate from '../models/Candidate.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { TEACHING_POSITIONS } from '../config/constants.js';

const buildCandidateFilter = (schoolId, query) => {
  const filter = { schoolId, isDeleted: false };

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
  const allowed = ['fullName', 'mobile', 'position', 'experienceYears', 'createdAt'];
  const field = allowed.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  return { [field]: order };
};

export const getCandidates = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    ...filters
  } = req.query;

  const filter = buildCandidateFilter(req.schoolId, filters);
  const skip = (Number(page) - 1) * Number(limit);
  const sort = getSortOption(sortBy, sortOrder);

  const [candidates, total] = await Promise.all([
    Candidate.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Candidate.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: candidates,
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
    schoolId: req.schoolId,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  res.json({ success: true, data: candidate });
});

export const checkDuplicate = catchAsync(async (req, res) => {
  const { mobile } = req.query;
  if (!mobile) throw new ApiError(400, 'Mobile number is required');

  const filter = {
    schoolId: req.schoolId,
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
      schoolId: req.schoolId,
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

  const candidate = await Candidate.create({
    ...req.body,
    schoolId: req.schoolId,
    mobile: mobile.trim(),
  });

  res.status(201).json({ success: true, data: candidate });
});

export const updateCandidate = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    schoolId: req.schoolId,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  if (req.body.mobile && req.body.mobile !== candidate.mobile) {
    const duplicate = await Candidate.findOne({
      schoolId: req.schoolId,
      mobile: req.body.mobile.trim(),
      isDeleted: false,
      _id: { $ne: candidate._id },
    });

    if (duplicate) {
      throw new ApiError(409, 'Another candidate with this mobile number exists');
    }
  }

  Object.assign(candidate, req.body);
  if (req.body.mobile) candidate.mobile = req.body.mobile.trim();
  await candidate.save();

  res.json({ success: true, data: candidate });
});

export const deleteCandidate = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    schoolId: req.schoolId,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Candidate not found');

  candidate.isDeleted = true;
  await candidate.save();

  res.json({ success: true, message: 'Candidate deleted successfully' });
});

export const getDashboardStats = catchAsync(async (req, res) => {
  const schoolId = req.schoolId;
  const baseFilter = { schoolId, isDeleted: false };

  const [totalCandidates, teachers, nonTeachingStaff, recentCandidates] = await Promise.all([
    Candidate.countDocuments(baseFilter),
    Candidate.countDocuments({
      ...baseFilter,
      position: { $in: TEACHING_POSITIONS },
    }),
    Candidate.countDocuments({
      ...baseFilter,
      position: { $nin: TEACHING_POSITIONS },
    }),
    Candidate.find(baseFilter).sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    success: true,
    data: {
      totalCandidates,
      teachers,
      nonTeachingStaff,
      recentCandidates,
    },
  });
});
