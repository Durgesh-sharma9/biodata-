import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, index: true },
    signature: { type: String },
    amount: { type: Number, required: true }, // In INR
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
      index: true,
    },
    paymentType: {
      type: String,
      enum: ['CREDIT_PACKAGE', 'APPLICANT_PLAN', 'SCHOOL_PLAN'],
      required: true,
      index: true,
    },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditPackage' },
    planId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('PaymentTransaction', paymentTransactionSchema);
