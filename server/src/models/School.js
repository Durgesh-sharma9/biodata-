import mongoose from 'mongoose';
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUSES } from '../config/constants.js';

const schoolSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subscriptionPlan: { type: String, enum: SUBSCRIPTION_PLANS, default: 'basic' },
    subscriptionStatus: { type: String, enum: SUBSCRIPTION_STATUSES, default: 'trial' },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('School', schoolSchema);
