import mongoose from 'mongoose';
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUSES } from '../config/constants.js';

const schoolSchema = new mongoose.Schema(
  {
    schoolId: { type: String, required: true, unique: true, trim: true },
    schoolName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    subscriptionPlan: { type: String, enum: SUBSCRIPTION_PLANS, default: 'basic' },
    subscriptionStatus: { type: String, enum: SUBSCRIPTION_STATUSES, default: 'trial' },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', default: null },
    credits: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('School', schoolSchema);
