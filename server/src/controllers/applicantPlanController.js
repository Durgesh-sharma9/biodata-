import ApplicantPlan from '../models/ApplicantPlan.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getApplicantPlans = catchAsync(async (req, res) => {
  const filter = req.user?.role === 'super_admin' ? {} : { isActive: true };
  const plans = await ApplicantPlan.find(filter).sort({ price: 1 });
  res.json({ success: true, data: plans });
});

export const createApplicantPlan = catchAsync(async (req, res) => {
  const { name, price, durationDays, features } = req.body;

  if (!name || price == null || !durationDays) {
    throw new ApiError(400, 'Name, price, and duration are required');
  }

  const plan = await ApplicantPlan.create({
    name,
    price,
    durationDays,
    features: features || [],
  });

  res.status(201).json({ success: true, data: plan });
});

export const updateApplicantPlan = catchAsync(async (req, res) => {
  const plan = await ApplicantPlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!plan) throw new ApiError(404, 'Applicant plan not found');
  res.json({ success: true, data: plan });
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
