import ApplicantSubscription from '../models/ApplicantSubscription.js';

export const getActiveApplicantSubscription = async (userId) => {
  const now = new Date();
  const subscription = await ApplicantSubscription.findOne({
    userId,
    status: 'active',
    expiryDate: { $gt: now },
  })
    .populate('planId')
    .sort({ expiryDate: -1 });

  if (!subscription) return null;

  return subscription;
};

export const hasActiveApplicantPlan = async (userId) => {
  const subscription = await getActiveApplicantSubscription(userId);
  return !!subscription && subscription.price > 0;
};

export const expireApplicantSubscriptions = async (userId) => {
  const now = new Date();
  await ApplicantSubscription.updateMany(
    { userId, status: 'active', expiryDate: { $lte: now } },
    { status: 'expired' }
  );
};
