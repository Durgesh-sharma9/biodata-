import ApplicantPlan from '../models/ApplicantPlan.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getApplicantPlans = catchAsync(async (req, res) => {
  const filter = req.user?.role === 'super_admin' ? {} : { isActive: true };
  const plans = await ApplicantPlan.find(filter).sort({ price: 1 });
  res.json({ success: true, data: plans });
});

export const createApplicantPlan = catchAsync(async (req, res) => {
  const { name, planType, price, requestCount, durationDays, features } = req.body;

  if (!name || price == null || !planType) {
    throw new ApiError(400, 'Name, price, and plan type are required');
  }

  if (planType === 'REQUEST_BASED' && !requestCount) {
    throw new ApiError(400, 'Request count is required for request-based plans');
  }

  if (planType === 'UNLIMITED' && !durationDays) {
    throw new ApiError(400, 'Duration is required for unlimited plans');
  }

  // Check for existing plan with same name (case-insensitive, trimmed)
  const trimmedName = name.trim();
  const existingPlan = await ApplicantPlan.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
  });

  if (existingPlan) {
    throw new ApiError(400, 'Applicant Plan with this name already exists.');
  }

  const plan = await ApplicantPlan.create({
    name: trimmedName,
    planType,
    price,
    requestCount: planType === 'REQUEST_BASED' ? requestCount : null,
    durationDays: planType === 'UNLIMITED' ? durationDays : null,
    features: features || [],
  });

  res.status(201).json({ success: true, data: plan });
});

export const updateApplicantPlan = catchAsync(async (req, res) => {
  const { name, planType, price, requestCount, durationDays, features } = req.body;

  const plan = await ApplicantPlan.findById(req.params.id);
  if (!plan) throw new ApiError(404, 'Applicant plan not found');

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (price !== undefined) updateData.price = price;
  if (planType !== undefined) updateData.planType = planType;
  if (features !== undefined) updateData.features = features;

  // Handle plan type-specific fields
  const finalPlanType = planType || plan.planType;
  if (finalPlanType === 'REQUEST_BASED') {
    if (requestCount !== undefined) updateData.requestCount = requestCount;
    if (durationDays !== undefined) updateData.durationDays = null;
  } else if (finalPlanType === 'UNLIMITED') {
    if (durationDays !== undefined) updateData.durationDays = durationDays;
    if (requestCount !== undefined) updateData.requestCount = null;
  }

  const updatedPlan = await ApplicantPlan.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: updatedPlan });
});

export const deleteApplicantPlan = catchAsync(async (req, res) => {
  const plan = await ApplicantPlan.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!plan) throw new ApiError(404, 'Applicant plan not found');
  res.json({ success: true, message: 'Applicant plan disabled', data: plan });
});
