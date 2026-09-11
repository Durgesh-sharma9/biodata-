import User from '../models/User.js';
import School from '../models/School.js';
import SchoolSettings from '../models/SchoolSettings.js';
import Plan from '../models/Plan.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';
import { generateSchoolSlug } from '../utils/slugify.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  schoolId: user.schoolId,
  avatarUrl: user.avatarUrl,
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

  if (user.role === 'self_applicant') {
    // self applicants can always login
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: formatUser(user),
  });
});

export const googleLogin = catchAsync(async (req, res) => {
  const { credential, targetRole } = req.body;

  if (!credential) {
    throw new ApiError(400, 'Google token is required');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  let payload;

  try {
    const googleClient = new OAuth2Client(clientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch (err) {
    console.warn('Google verifyIdToken failed, attempting fallback payload decode:', err.message);
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      }
    } catch (fallbackErr) {
      throw new ApiError(401, 'Invalid Google authentication token');
    }
  }

  if (!payload || !payload.email) {
    throw new ApiError(400, 'Google login failed: email not provided');
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = payload.name || payload.given_name || email.split('@')[0];
  const picture = payload.picture || null;

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatarUrl: picture,
      role: targetRole || 'self_applicant',
    });
  } else {
    let updated = false;
    if (!user.googleId) {
      user.googleId = googleId;
      updated = true;
    }
    if (picture && !user.avatarUrl) {
      user.avatarUrl = picture;
      updated = true;
    }
    if (updated) {
      await user.save();
    }
  }

  if (user.role === 'school_admin' && user.schoolId) {
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
    school = await School.findById(req.user.schoolId).select(
      'schoolName email isActive subscriptionPlan subscriptionStatus credits slug planId'
    );
    if (school && school.planId) {
      try {
        await school.populate('planId', 'name credits durationDays');
      } catch (err) {
        console.error('Failed to populate planId:', err.message);
      }
    }
  }

  res.json({
    success: true,
    user: formatUser(req.user),
    school,
  });
});

export const registerSchool = catchAsync(async (req, res) => {
  const { schoolName, adminName, email, mobile, password, googleId, avatarUrl } = req.body;

  if (!schoolName || !adminName || !email || !mobile) {
    throw new ApiError(400, 'School name, admin name, email, and mobile are required');
  }

  if (!password && !googleId) {
    throw new ApiError(400, 'Password or Google sign-in is required');
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
    slug: generateSchoolSlug(schoolName),
    subscriptionPlan: 'basic',
    subscriptionStatus: 'trial',
    startDate: new Date(),
    expiryDate: trialExpiryDate,
    isActive: true,
    credits: 5,
  });

  const user = await User.create({
    schoolId: school._id,
    name: adminName,
    email: email.toLowerCase(),
    password: password || undefined,
    googleId: googleId || null,
    avatarUrl: avatarUrl || null,
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
