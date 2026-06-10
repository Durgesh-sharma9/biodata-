import CreditPackage from '../models/CreditPackage.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getCreditPackages = catchAsync(async (req, res) => {
  const packages = await CreditPackage.find().sort({ credits: 1 });
  res.json({ success: true, data: packages });
});

export const createCreditPackage = catchAsync(async (req, res) => {
  const { name, credits } = req.body;
  if (!name || !credits) throw new ApiError(400, 'Name and credits are required');
  const pkg = await CreditPackage.create({ name, credits });
  res.status(201).json({ success: true, data: pkg });
});

export const updateCreditPackage = catchAsync(async (req, res) => {
  const pkg = await CreditPackage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pkg) throw new ApiError(404, 'Credit package not found');
  res.json({ success: true, data: pkg });
});

export const deleteCreditPackage = catchAsync(async (req, res) => {
  const pkg = await CreditPackage.findByIdAndDelete(req.params.id);
  if (!pkg) throw new ApiError(404, 'Credit package not found');
  res.json({ success: true, message: 'Credit package deleted' });
});
