import Plan from '../models/Plan.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getPlans = catchAsync(async (req, res) => {
  const plans = await Plan.find().sort({ createdAt: -1 });
  res.json({ success: true, data: plans });
});

export const createPlan = catchAsync(async (req, res) => {
  const { name, credits, durationDays } = req.body;
  if (!name || credits == null || !durationDays) {
    throw new ApiError(400, 'Name, credits, and duration are required');
  }
  const plan = await Plan.create({ name, credits, durationDays });
  res.status(201).json({ success: true, data: plan });
});

export const updatePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plan) throw new ApiError(404, 'Plan not found');
  res.json({ success: true, data: plan });
});

export const deletePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);
  if (!plan) throw new ApiError(404, 'Plan not found');
  res.json({ success: true, message: 'Plan deleted' });
});
