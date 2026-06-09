import School from '../models/School.js';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import SchoolSettings from '../models/SchoolSettings.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getSchools = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = '', status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};
  if (search) {
    filter.$or = [
      { schoolName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  const [schools, total] = await Promise.all([
    School.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    School.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: schools,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getSchool = catchAsync(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) throw new ApiError(404, 'School not found');

  const [admin, candidateCount] = await Promise.all([
    User.findOne({ schoolId: school._id, role: 'school_admin' }).select('name email'),
    Candidate.countDocuments({ schoolId: school._id, isDeleted: false }),
  ]);

  res.json({
    success: true,
    data: { school, admin, candidateCount },
  });
});

export const createSchool = catchAsync(async (req, res) => {
  const {
    schoolName,
    email,
    phone,
    subscriptionPlan,
    subscriptionStatus,
    startDate,
    expiryDate,
    adminName,
    adminEmail,
    adminPassword,
  } = req.body;

  if (!schoolName || !email || !adminName || !adminEmail || !adminPassword) {
    throw new ApiError(400, 'School name, email, and admin credentials are required');
  }

  const existingSchool = await School.findOne({ email: email.toLowerCase() });
  if (existingSchool) throw new ApiError(400, 'School email already exists');

  const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existingUser) throw new ApiError(400, 'Admin email already exists');

  const school = await School.create({
    schoolName,
    email,
    phone,
    subscriptionPlan,
    subscriptionStatus,
    startDate,
    expiryDate,
    isActive: true,
  });

  await User.create({
    schoolId: school._id,
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'school_admin',
  });

  await SchoolSettings.create({ schoolId: school._id });

  res.status(201).json({ success: true, data: school });
});

export const updateSchool = catchAsync(async (req, res) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!school) throw new ApiError(404, 'School not found');

  res.json({ success: true, data: school });
});

export const toggleSchoolStatus = catchAsync(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) throw new ApiError(404, 'School not found');

  school.isActive = !school.isActive;
  await school.save();

  res.json({ success: true, data: school });
});

export const getPlatformStats = catchAsync(async (req, res) => {
  const [totalSchools, activeSchools, inactiveSchools, totalCandidates, totalUsers] = await Promise.all([
    School.countDocuments(),
    School.countDocuments({ isActive: true }),
    School.countDocuments({ isActive: false }),
    Candidate.countDocuments({ isDeleted: false }),
    User.countDocuments({ role: 'school_admin' }),
  ]);

  const subscriptionBreakdown = await School.aggregate([
    { $group: { _id: '$subscriptionPlan', count: { $sum: 1 } } },
  ]);

  const recentSchools = await School.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    data: {
      totalSchools,
      activeSchools,
      inactiveSchools,
      totalCandidates,
      totalUsers,
      subscriptionBreakdown,
      recentSchools,
    },
  });
});
