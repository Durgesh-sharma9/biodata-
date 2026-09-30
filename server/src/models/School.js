import mongoose from 'mongoose';
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUSES } from '../config/constants.js';

const generateSchoolCode = () =>
  'SCH-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 6).toUpperCase();

const schoolSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: generateSchoolCode,
    },
    schoolName: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: null, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    area: { type: String, trim: true },
    address: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    locationUpdatedAt: { type: Date },
    workingRadius: { type: Number, min: 0 },
    // School Institutional & Recruitment Profile Details
    boardAffiliation: { type: String, trim: true, default: 'CBSE' },
    schoolLevel: { type: String, trim: true, default: 'Senior Secondary (K-12)' },
    website: { type: String, trim: true, default: '' },
    establishedYear: { type: Number, min: 1800, max: 2100 },
    aboutSchool: { type: String, trim: true, default: '' },
    hrContactPerson: { type: String, trim: true, default: '' },
    altPhone: { type: String, trim: true, default: '' },
    walkInTimings: { type: String, trim: true, default: '09:00 AM - 03:00 PM (Mon-Sat)' },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
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

schoolSchema.pre('validate', function (next) {
  if (!this.schoolId) {
    this.schoolId = generateSchoolCode();
  }
  next();
});

export default mongoose.model('School', schoolSchema);
