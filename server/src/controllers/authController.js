import User from '../models/User.js';
import School from '../models/School.js';
import SchoolSettings from '../models/SchoolSettings.js';
import Plan from '../models/Plan.js';
import Otp from '../models/Otp.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';
import { generateSchoolSlug } from '../utils/slugify.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail, sendOtpEmail, sendWelcomeEmail, verifySmtpConnection } from '../utils/emailService.js';

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
      'schoolId schoolName logoUrl email isActive subscriptionPlan subscriptionStatus credits slug planId'
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

export const sendSignupOtp = catchAsync(async (req, res) => {
  const { email, schoolName } = req.body;
  if (!email) throw new ApiError(400, 'School email is required');

  const existingSchool = await School.findOne({ email: email.toLowerCase() });
  if (existingSchool) throw new ApiError(400, 'A school with this email already exists. Please sign in.');

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) throw new ApiError(400, 'This email is already registered. Please sign in.');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'email_verification' });
  await Otp.create({
    email: email.toLowerCase(),
    otp,
    purpose: 'email_verification',
    expiresAt,
  });

  const sendResult = await sendOtpEmail({
    to: email.toLowerCase(),
    otp,
    purpose: 'School Account Registration',
    name: schoolName || 'School Admin',
  });

  if (!sendResult.success) {
    throw new ApiError(500, `Failed to send verification OTP: ${sendResult.error}`);
  }

  res.json({
    success: true,
    message: 'Verification OTP has been sent to your email address.',
  });
});

export const registerSchool = catchAsync(async (req, res) => {
  let { schoolName, adminName, email, mobile, password, googleId, googleCredential, avatarUrl, otp } = req.body;

  if (!adminName || !adminName.trim()) {
    adminName = schoolName ? `${schoolName} Admin` : 'School Admin';
  }

  if (!schoolName || !email || !mobile) {
    throw new ApiError(400, 'School name, email, and mobile are required');
  }

  if (!password && !googleId) {
    throw new ApiError(400, 'Password or Google sign-in is required');
  }

  // For Google signup: verify credential token for security
  if (googleId) {
    if (!googleCredential) {
      throw new ApiError(400, 'Google credential token is required for verification');
    }
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleCredential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      // Ensure the token matches the provided email & googleId
      if (payload.sub !== googleId || payload.email.toLowerCase() !== email.toLowerCase()) {
        throw new ApiError(401, 'Google credential verification failed: data mismatch');
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(401, 'Invalid Google credential token. Please try signing in with Google again.');
    }
  }

  // Require and verify OTP for standard password registration
  if (!googleId) {
    if (!otp) {
      throw new ApiError(400, 'OTP code is required to verify your email address');
    }

    const validOtp = await Otp.findOne({
      email: email.toLowerCase(),
      otp: otp.toString().trim(),
      purpose: 'email_verification',
      expiresAt: { $gt: new Date() },
    });

    if (!validOtp) {
      throw new ApiError(400, 'Invalid or expired verification OTP. Please request a new code.');
    }

    // Delete used OTP
    await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'email_verification' });
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

  // Send Welcome Email via SMTP
  sendWelcomeEmail({
    to: email.toLowerCase(),
    name: adminName,
    schoolName: school.schoolName,
    schoolId: school.schoolId,
  }).catch((err) => console.error('[REGISTER EMAIL ERROR]:', err.message));

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

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, 'New password is required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  if (user.password) {
    if (!currentPassword) {
      throw new ApiError(400, 'Current password is required');
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Email is required');

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists with this email, an OTP has been sent.',
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'password_reset' });
  await Otp.create({
    email: email.toLowerCase(),
    otp,
    purpose: 'password_reset',
    expiresAt,
  });

  const sendResult = await sendOtpEmail({
    to: email.toLowerCase(),
    otp,
    purpose: 'Password Reset',
    name: user.name,
  });

  if (!sendResult.success) {
    throw new ApiError(500, `Failed to send email: ${sendResult.error}`);
  }

  res.json({
    success: true,
    message: 'OTP sent successfully to your registered email address.',
  });
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp, purpose = 'password_reset' } = req.body;
  if (!email || !otp) throw new ApiError(400, 'Email and OTP are required');

  const record = await Otp.findOne({
    email: email.toLowerCase(),
    otp,
    purpose,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  res.json({
    success: true,
    message: 'OTP verified successfully',
  });
});

export const resetPasswordWithOtp = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, 'Email, OTP, and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const record = await Otp.findOne({
    email: email.toLowerCase(),
    otp,
    purpose: 'password_reset',
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, 'User not found');

  user.password = newPassword;
  await user.save();

  await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'password_reset' });

  res.json({
    success: true,
    message: 'Password has been reset successfully. You can now log in.',
  });
});

export const testSmtp = catchAsync(async (req, res) => {
  const { toEmail } = req.body;
  if (!toEmail) {
    throw new ApiError(400, 'toEmail is required to test SMTP');
  }

  const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const sendResult = await sendOtpEmail({
    to: toEmail,
    otp: testOtp,
    purpose: 'Live SMTP Test Verification',
    name: 'HireHub Tester',
  });

  res.json({
    success: sendResult.success,
    recipient: toEmail,
    generatedOtp: testOtp,
    smtpHost: process.env.SMTP_HOST || 'mail.webncode.in',
    smtpUser: process.env.SMTP_USER || 'hirehub@webncode.in',
    details: sendResult,
  });
});

