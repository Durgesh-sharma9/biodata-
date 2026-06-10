import School from '../models/School.js';
import UnlockHistory from '../models/UnlockHistory.js';
import CreditPackage from '../models/CreditPackage.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getSchoolCredits = catchAsync(async (req, res) => {
  const school = await School.findById(req.schoolId).populate('planId', 'name credits durationDays');
  if (!school) throw new ApiError(404, 'School not found');

  res.json({
    success: true,
    data: {
      credits: school.credits,
      plan: school.planId,
      expiryDate: school.expiryDate,
    },
  });
});

export const getUnlockHistory = catchAsync(async (req, res) => {
  const history = await UnlockHistory.find({ schoolId: req.schoolId })
    .populate('candidateId', 'fullName position source')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: history });
});

export const assignCreditsToSchool = catchAsync(async (req, res) => {
  const { schoolId, credits, planId } = req.body;
  if (!schoolId) throw new ApiError(400, 'School ID is required');

  const school = await School.findById(schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  if (credits != null) {
    school.credits = (school.credits || 0) + Number(credits);
  }

  if (planId) {
    const Plan = (await import('../models/Plan.js')).default;
    const plan = await Plan.findById(planId);
    if (!plan) throw new ApiError(404, 'Plan not found');
    school.planId = plan._id;
    school.credits = (school.credits || 0) + plan.credits;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.durationDays);
    school.expiryDate = expiry;
    school.subscriptionStatus = 'active';
  }

  await school.save();
  res.json({ success: true, data: school });
});

export const purchaseCreditPackage = catchAsync(async (req, res) => {
  const { packageId } = req.body;
  const pkg = await CreditPackage.findById(packageId);
  if (!pkg || !pkg.isActive) throw new ApiError(404, 'Credit package not found');

  const school = await School.findById(req.schoolId);
  school.credits = (school.credits || 0) + pkg.credits;
  await school.save();

  res.json({
    success: true,
    data: { credits: school.credits, added: pkg.credits },
    message: `${pkg.credits} credits added to your account`,
  });
});
