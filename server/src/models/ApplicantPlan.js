import mongoose from 'mongoose';

const applicantPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    planType: {
      type: String,
      enum: ['REQUEST_BASED', 'UNLIMITED'],
      required: true,
      default: 'UNLIMITED',
    },
    price: { type: Number, required: true, min: 0 },
    requestCount: {
      type: Number,
      default: null,
      min: 1,
    },
    durationDays: {
      type: Number,
      required: function () {
        return this.planType === 'UNLIMITED';
      },
      min: 1,
    },
    features: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('ApplicantPlan', applicantPlanSchema);
