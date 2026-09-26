import School from '../models/School.js';
import UnlockHistory from '../models/UnlockHistory.js';
import CreditPackage from '../models/CreditPackage.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { isMonetizedTalentPoolCandidate } from '../utils/candidateAccess.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../utils/razorpay.js';

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

  const sanitized = history.map((entry) => {
    const obj = entry.toObject();
    if (obj.candidateId && isMonetizedTalentPoolCandidate(obj.candidateId)) {
      obj.candidateId = { ...obj.candidateId, source: undefined };
    }
    return obj;
  });

  res.json({ success: true, data: sanitized });
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

export const createCreditOrder = catchAsync(async (req, res) => {
  const { packageId } = req.body;
  if (!packageId) throw new ApiError(400, 'Package ID is required');

  const pkg = await CreditPackage.findById(packageId);
  if (!pkg || !pkg.isActive) throw new ApiError(404, 'Credit package not found');

  const price = pkg.price || Math.max(99, pkg.credits * 15);

  const order = await createRazorpayOrder({
    amount: price,
    currency: 'INR',
    receipt: `sch_crd_${Date.now()}`,
    notes: {
      packageId: String(pkg._id),
      schoolId: String(req.schoolId),
      credits: String(pkg.credits),
    },
  });

  await PaymentTransaction.create({
    orderId: order.id,
    amount: price,
    currency: 'INR',
    status: 'created',
    paymentType: 'CREDIT_PACKAGE',
    schoolId: req.schoolId,
    packageId: pkg._id,
    details: { packageName: pkg.name, credits: pkg.credits },
  });

  res.json({
    success: true,
    data: {
      orderId: order.id,
      amount: price,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      packageName: pkg.name,
      credits: pkg.credits,
    },
  });
});

export const verifyCreditPayment = catchAsync(async (req, res) => {
  const { packageId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, 'Incomplete payment verification payload');
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    await PaymentTransaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'failed', paymentId: razorpay_payment_id }
    );
    throw new ApiError(400, 'Invalid payment signature. Transaction rejected.');
  }

  const pkg = await CreditPackage.findById(packageId);
  if (!pkg) throw new ApiError(404, 'Credit package not found');

  const school = await School.findById(req.schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  school.credits = (school.credits || 0) + pkg.credits;
  await school.save();

  await PaymentTransaction.findOneAndUpdate(
    { orderId: razorpay_order_id },
    {
      status: 'paid',
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    }
  );

  res.json({
    success: true,
    data: {
      credits: school.credits,
      added: pkg.credits,
      paymentId: razorpay_payment_id,
    },
    message: `Payment verified! ${pkg.credits} credits successfully added to your wallet.`,
  });
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
