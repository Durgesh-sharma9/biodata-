import InterestRequest from '../models/InterestRequest.js';
import Candidate from '../models/Candidate.js';
import School from '../models/School.js';
import UnlockHistory from '../models/UnlockHistory.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  isOwnedBySchool,
  isMonetizedTalentPoolCandidate,
} from '../utils/candidateAccess.js';
import { notifyInterestRequest } from '../utils/notifications.js';

const ensureUnlocked = async (schoolId, candidateId) => {
  if (!schoolId) return false;

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) return false;

  if (isOwnedBySchool(candidate, schoolId)) return true;

  const unlock = await UnlockHistory.findOne({ schoolId, candidateId });
  return !!unlock;
};

export const sendInterestRequest = catchAsync(async (req, res) => {
  const { candidateId, positionOffered, message } = req.body;

  if (!candidateId || !positionOffered || !message) {
    throw new ApiError(400, 'Candidate, position offered, and message are required');
  }

  const candidate = await Candidate.findOne({ _id: candidateId, isDeleted: false });
  if (!candidate) throw new ApiError(404, 'Candidate not found');

  if (!isMonetizedTalentPoolCandidate(candidate)) {
    throw new ApiError(400, 'Interest requests are only available for talent pool candidates');
  }

  const unlocked = await ensureUnlocked(req.schoolId, candidateId);
  if (!unlocked) {
    throw new ApiError(403, 'Unlock this candidate profile before sending an interest request');
  }

  const school = await School.findById(req.schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  const existing = await InterestRequest.findOne({
    schoolId: req.schoolId,
    candidateId,
  });

  if (existing) {
    throw new ApiError(409, 'You have already sent an interest request to this candidate');
  }

  const interestRequest = await InterestRequest.create({
    schoolId: req.schoolId,
    candidateId,
    schoolName: school.schoolName,
    positionOffered,
    message,
  });

  if (candidate.applicantUserId) {
    await notifyInterestRequest({
      userId: candidate.applicantUserId,
      interestRequest,
      schoolName: school.schoolName,
      positionOffered,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Interest request sent successfully',
    data: interestRequest,
  });
});

export const getSentInterestRequests = catchAsync(async (req, res) => {
  const requests = await InterestRequest.find({ schoolId: req.schoolId })
    .populate('candidateId', 'fullName position')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: requests });
});

export const getInterestRequestStatus = catchAsync(async (req, res) => {
  const { candidateId } = req.params;

  const request = await InterestRequest.findOne({
    schoolId: req.schoolId,
    candidateId,
  });

  res.json({ success: true, data: request });
});
