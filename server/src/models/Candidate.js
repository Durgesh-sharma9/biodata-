import mongoose from 'mongoose';
import { CANDIDATE_SOURCES } from '../config/constants.js';

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'other' },
  },
  { _id: true }
);

const candidateSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
      index: true,
    },
    ownerSchoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
      index: true,
    },
    applicantUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    source: {
      type: String,
      enum: CANDIDATE_SOURCES,
      default: 'ADMIN',
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    position: { type: String, required: true, trim: true },
    qualifications: [{ type: String, trim: true }],
    subjects: [{ type: String, trim: true }],
    classesCanTeach: [{ type: String, trim: true }],
    vehicleTypes: [{ type: String, trim: true }],
    experienceYears: { type: Number, default: 0, min: 0 },
    expectedSalary: { type: Number, min: 0 },
    state: { type: String, trim: true, index: true },
    city: { type: String, trim: true, index: true },
    locality: { type: String, trim: true, index: true },
    localityCluster: { type: String, trim: true, index: true },
    profileSharingConsent: { type: Boolean, default: false },
    contactConsent: { type: Boolean, default: false },
    notes: { type: String, trim: true },
    documents: [documentSchema],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

candidateSchema.index({ ownerSchoolId: 1, mobile: 1 });
candidateSchema.index({ fullName: 1 });
candidateSchema.index({ position: 1 });
candidateSchema.index({ createdAt: -1 });
candidateSchema.index({ expectedSalary: 1 });

candidateSchema.pre('save', function (next) {
  if (this.ownerSchoolId && !this.schoolId) {
    this.schoolId = this.ownerSchoolId;
  }
  if (this.schoolId && !this.ownerSchoolId && this.source === 'ADMIN') {
    this.ownerSchoolId = this.schoolId;
  }
  next();
});

export default mongoose.model('Candidate', candidateSchema);
