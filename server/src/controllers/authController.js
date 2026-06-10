import User from '../models/User.js';
import School from '../models/School.js';
import SchoolSettings from '../models/SchoolSettings.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  schoolId: user.schoolId,
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.role === 'school_admin') {
    const school = await School.findById(user.schoolId);
    if (!school?.isActive) {
      throw new ApiError(403, 'Your school account is inactive');
    }
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: formatUser(user),
  });
});

export const getMe = catchAsync(async (req, res) => {
  let school = null;
  if (req.user.schoolId) {
    school = await School.findById(req.user.schoolId).select('schoolName email isActive subscriptionPlan subscriptionStatus');
  }

  res.json({
    success: true,
    user: formatUser(req.user),
    school,
  });
});

export const registerSchool = catchAsync(async (req, res) => {
  const { schoolName, adminName, email, mobile, password } = req.body;

  if (!schoolName || !adminName || !email || !mobile || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingSchool = await School.findOne({ email: email.toLowerCase() });
  if (existingSchool) throw new ApiError(400, 'School email already exists');

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new ApiError(400, 'Email already registered');

  const trialExpiryDate = new Date();
  trialExpiryDate.setDate(trialExpiryDate.getDate() + 30);

  const schoolId = 'SCH-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 6).toUpperCase();

  const school = await School.create({
    schoolId,
    schoolName,
    email: email.toLowerCase(),
    phone: mobile,
    subscriptionPlan: 'basic',
    subscriptionStatus: 'trial',
    startDate: new Date(),
    expiryDate: trialExpiryDate,
    isActive: true,
  });

  const user = await User.create({
    schoolId: school._id,
    name: adminName,
    email: email.toLowerCase(),
    password,
    role: 'school_admin',
  });

  await SchoolSettings.create({ schoolId: school._id });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: formatUser(user),
    school: {
      schoolId: school.schoolId,
      schoolName: school.schoolName,
      email: school.email,
      subscriptionPlan: school.subscriptionPlan,
      subscriptionStatus: school.subscriptionStatus,
      expiryDate: school.expiryDate,
    },
  });
});
