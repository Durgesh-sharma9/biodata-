import mongoose from 'mongoose';

const creditPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('CreditPackage', creditPackageSchema);
