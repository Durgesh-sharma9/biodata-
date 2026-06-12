import mongoose from 'mongoose';

const applicantSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApplicantPlan',
      required: true,
    },
    planName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true }
);

applicantSubscriptionSchema.index({ userId: 1, status: 1, expiryDate: -1 });

export default mongoose.model('ApplicantSubscription', applicantSubscriptionSchema);
