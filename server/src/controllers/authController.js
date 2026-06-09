import User from '../models/User.js';
import School from '../models/School.js';
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
