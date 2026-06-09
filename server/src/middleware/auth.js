import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';
import School from '../models/School.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Not authorized, no token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;

    if (user.role === 'school_admin') {
      if (!user.schoolId) {
        return next(new ApiError(403, 'School not assigned'));
      }

      const school = await School.findById(user.schoolId);
      if (!school || !school.isActive) {
        return next(new ApiError(403, 'School is inactive or not found'));
      }

      req.schoolId = user.schoolId;
      req.school = school;
    }

    next();
  } catch {
    return next(new ApiError(401, 'Not authorized, invalid token'));
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Not authorized for this action'));
  }
  next();
};
