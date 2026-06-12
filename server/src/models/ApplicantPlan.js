import mongoose from 'mongoose';

const applicantPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    features: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('ApplicantPlan', applicantPlanSchema);
