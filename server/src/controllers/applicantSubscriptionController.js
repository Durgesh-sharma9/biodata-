import ApplicantPlan from '../models/ApplicantPlan.js';
import ApplicantSubscription from '../models/ApplicantSubscription.js';
import InterestRequest from '../models/InterestRequest.js';
import School from '../models/School.js';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
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

  const user = await User.findById(req.user._id).select('requestCredits activePlan planExpiryDate unlockedRequests');

  res.json({
    success: true,
    data: {
      hasActivePlan: !!subscription && subscription.price > 0,
      subscription,
      requestCredits: user?.requestCredits || 0,
      activePlan: user?.activePlan,
      planExpiryDate: user?.planExpiryDate,
      unlockedRequestsCount: user?.unlockedRequests?.length || 0,
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

  const user = await User.findById(req.user._id);

  if (plan.planType === 'REQUEST_BASED') {
    // Add request credits to user account
    user.requestCredits = (user.requestCredits || 0) + plan.requestCount;
    await user.save();

    // Create subscription record for history
    const subscription = await ApplicantSubscription.create({
      userId: req.user._id,
      candidateId: candidate._id,
      planId: plan._id,
      planType: plan.planType,
      planName: plan.name,
      price: plan.price,
      requestCount: plan.requestCount,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      status: 'active',
    });

    res.json({
      success: true,
      message: `Successfully purchased ${plan.name}. ${plan.requestCount} request credits added to your account.`,
      data: subscription,
    });
  } else if (plan.planType === 'UNLIMITED') {
    // Set active unlimited plan on user
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    user.activePlan = plan._id;
    user.planExpiryDate = expiryDate;
    await user.save();

    // Create subscription record for history
    const subscription = await ApplicantSubscription.create({
      userId: req.user._id,
      candidateId: candidate._id,
      planId: plan._id,
      planType: plan.planType,
      planName: plan.name,
      price: plan.price,
      durationDays: plan.durationDays,
      expiryDate,
      status: 'active',
    });

    res.json({
      success: true,
      message: `Successfully subscribed to ${plan.name}. Valid until ${expiryDate.toLocaleDateString()}.`,
      data: subscription,
    });
  }
});

export const getReceivedRequests = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Applicant profile not found');

  const requests = await InterestRequest.find({ candidateId: candidate._id })
    .sort({ createdAt: -1 });

  const user = await User.findById(req.user._id).select('requestCredits activePlan planExpiryDate unlockedRequests');

  // Check if user has active unlimited plan
  const hasUnlimitedPlan = user.activePlan && user.planExpiryDate && new Date(user.planExpiryDate) > new Date();

  const formatted = requests.map((request) => {
    const isUnlocked = user.unlockedRequests?.some((id) => id.toString() === request._id.toString());
    return {
      _id: request._id,
      schoolName: request.schoolName,
      positionOffered: request.positionOffered,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
      isUnlocked,
      canViewSchoolContact: isUnlocked || hasUnlimitedPlan || (user.requestCredits > 0),
      schoolId: (isUnlocked || hasUnlimitedPlan) ? request.schoolId : undefined,
    };
  });

  res.json({
    success: true,
    data: formatted,
    hasActivePlan: hasUnlimitedPlan,
    requestCredits: user.requestCredits,
  });
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

  const user = await User.findById(req.user._id).select('requestCredits activePlan planExpiryDate unlockedRequests');

  // Check if request is already unlocked
  const isUnlocked = user.unlockedRequests?.some((id) => id.toString() === request._id.toString());

  // Check if user has active unlimited plan
  const hasUnlimitedPlan = user.activePlan && user.planExpiryDate && new Date(user.planExpiryDate) > new Date();

  if (!isUnlocked && !hasUnlimitedPlan) {
    return res.status(402).json({
      success: false,
      message: 'Request credits or unlimited plan required to view school contact details',
      requiresPayment: true,
      requestCredits: user.requestCredits,
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

  const user = await User.findById(req.user._id).select('requestCredits activePlan planExpiryDate unlockedRequests');

  // Check if user has active unlimited plan
  const hasUnlimitedPlan = user.activePlan && user.planExpiryDate && new Date(user.planExpiryDate) > new Date();

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
      hasActivePlan: hasUnlimitedPlan,
      subscription,
      requestCredits: user.requestCredits,
      unlockedRequestsCount: user.unlockedRequests?.length || 0,
    },
  });
});

export const unlockRequest = catchAsync(async (req, res) => {
  const request = await InterestRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, 'Request not found');

  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate || request.candidateId.toString() !== candidate._id.toString()) {
    throw new ApiError(403, 'Not authorized to unlock this request');
  }

  const user = await User.findById(req.user._id).select('requestCredits activePlan planExpiryDate unlockedRequests');

  // Check if request is already unlocked
  const isUnlocked = user.unlockedRequests?.some((id) => id.toString() === request._id.toString());
  if (isUnlocked) {
    // Return school details since already unlocked
    const school = await School.findById(request.schoolId);
    if (!school) throw new ApiError(404, 'School not found');

    return res.json({
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
  }

  // Check if user has active unlimited plan
  const hasUnlimitedPlan = user.activePlan && user.planExpiryDate && new Date(user.planExpiryDate) > new Date();

  if (hasUnlimitedPlan) {
    // Unlock without deduction
    user.unlockedRequests = user.unlockedRequests || [];
    user.unlockedRequests.push(request._id);
    await user.save();
  } else if (user.requestCredits > 0) {
    // Deduct 1 credit and unlock
    user.requestCredits = user.requestCredits - 1;
    user.unlockedRequests = user.unlockedRequests || [];
    user.unlockedRequests.push(request._id);
    await user.save();
  } else {
    // No credits or unlimited plan
    return res.status(402).json({
      success: false,
      message: 'Request credits or unlimited plan required to unlock school details',
      requiresPayment: true,
      requestCredits: user.requestCredits,
    });
  }

  // Get school details
  const school = await School.findById(request.schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  if (request.status === 'pending') {
    request.status = 'viewed';
    await request.save();
  }

  res.json({
    success: true,
    message: hasUnlimitedPlan ? 'Request unlocked (unlimited plan)' : 'Request unlocked (1 credit deducted)',
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
