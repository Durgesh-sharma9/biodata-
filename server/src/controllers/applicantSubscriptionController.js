import ApplicantPlan from '../models/ApplicantPlan.js';
import ApplicantSubscription from '../models/ApplicantSubscription.js';
import InterestRequest from '../models/InterestRequest.js';
import School from '../models/School.js';
import Candidate from '../models/Candidate.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  expireApplicantSubscriptions,
  getActiveApplicantSubscription,
  hasActiveApplicantPlan,
} from '../utils/applicantSubscription.js';

export const getApplicantSubscription = catchAsync(async (req, res) => {
  await expireApplicantSubscriptions(req.user._id);
  const subscription = await getActiveApplicantSubscription(req.user._id);

  res.json({
    success: true,
    data: {
      hasActivePlan: !!subscription && subscription.price > 0,
      subscription,
    },
  });
});

export const getApplicantSubscriptionHistory = catchAsync(async (req, res) => {
  const history = await ApplicantSubscription.find({ userId: req.user._id })
    .populate('planId', 'name price durationDays features')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: history });
});

export const purchaseApplicantPlan = catchAsync(async (req, res) => {
  const { planId } = req.body;
  if (!planId) throw new ApiError(400, 'Plan ID is required');

  const plan = await ApplicantPlan.findById(planId);
  if (!plan || !plan.isActive) throw new ApiError(404, 'Applicant plan not found');
  if (plan.price <= 0) throw new ApiError(400, 'This plan cannot be purchased');

  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Applicant profile not found');

  await expireApplicantSubscriptions(req.user._id);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

  const subscription = await ApplicantSubscription.create({
    userId: req.user._id,
    candidateId: candidate._id,
    planId: plan._id,
    planName: plan.name,
    price: plan.price,
    expiryDate,
    status: 'active',
  });

  res.json({
    success: true,
    message: `Successfully subscribed to ${plan.name}`,
    data: subscription,
  });
});

export const getReceivedRequests = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Applicant profile not found');

  const requests = await InterestRequest.find({ candidateId: candidate._id })
    .sort({ createdAt: -1 });

  const hasPlan = await hasActiveApplicantPlan(req.user._id);

  const formatted = requests.map((request) => ({
    _id: request._id,
    schoolName: request.schoolName,
    positionOffered: request.positionOffered,
    message: request.message,
    status: request.status,
    createdAt: request.createdAt,
    canViewSchoolContact: hasPlan,
    schoolId: hasPlan ? request.schoolId : undefined,
  }));

  res.json({ success: true, data: formatted, hasActivePlan: hasPlan });
});

export const getRequestSchoolDetails = catchAsync(async (req, res) => {
  const request = await InterestRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, 'Request not found');

  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate || request.candidateId.toString() !== candidate._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this request');
  }

  const hasPlan = await hasActiveApplicantPlan(req.user._id);
  if (!hasPlan) {
    return res.status(402).json({
      success: false,
      message: 'Active applicant plan required to view school contact details',
      requiresPayment: true,
    });
  }

  const school = await School.findById(request.schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  if (request.status === 'pending') {
    request.status = 'viewed';
    await request.save();
  }

  res.json({
    success: true,
    data: {
      request: {
        _id: request._id,
        schoolName: request.schoolName,
        positionOffered: request.positionOffered,
        message: request.message,
        createdAt: request.createdAt,
      },
      school: {
        schoolName: school.schoolName,
        email: school.email,
        phone: school.phone,
      },
    },
  });
});

export const getApplicantDashboard = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Applicant profile not found');

  await expireApplicantSubscriptions(req.user._id);
  const subscription = await getActiveApplicantSubscription(req.user._id);

  const [requestCount, unreadNotifications] = await Promise.all([
    InterestRequest.countDocuments({ candidateId: candidate._id }),
    (await import('../models/Notification.js')).default.countDocuments({
      userId: req.user._id,
      isRead: false,
    }),
  ]);

  res.json({
    success: true,
    data: {
      profileComplete: candidate.position && candidate.position !== 'Pending' && candidate.mobile !== 'pending',
      documentCount: candidate.documents?.length || 0,
      requestCount,
      unreadNotifications,
      hasActivePlan: !!subscription && subscription.price > 0,
      subscription,
    },
  });
});
