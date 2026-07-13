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
    gender: { type: String, trim: true },
    dob: { type: Date },
    address: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    workingRadius: { type: Number, min: 0 },
    position: { type: String, required: true, trim: true },
    profilePhoto: { type: String, trim: true },
    qualifications: [{ type: String, trim: true }],
    subjects: [{ type: String, trim: true }],
    classesCanTeach: [{ type: String, trim: true }],
    vehicleTypes: [{ type: String, trim: true }],
    experienceYears: { type: Number, default: 0, min: 0 },
    expectedSalary: { type: Number, min: 0 },
    state: { type: String, trim: true, index: true },
    city: { type: String, trim: true, index: true },
    area: { type: String, trim: true, index: true },
    // `address` field already exists above as the full address textarea
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', default: null },
    profileSharingConsent: { type: Boolean, default: false },
    contactConsent: { type: Boolean, default: false },
    notes: { type: String, trim: true },
    documents: [documentSchema],
    isDeleted: { type: Boolean, default: false, index: true },
    // Teacher-specific fields
    medium: { type: String, trim: true },
    boardExperience: [{ type: String, trim: true }],
    bEd: { type: Boolean, default: false },
    mEd: { type: Boolean, default: false },
    // Driver-specific fields
    lightVehicle: { type: Boolean, default: false },
    heavyVehicle: { type: Boolean, default: false },
    schoolBusExperience: { type: Boolean, default: false },
    drivingExperience: { type: Number, default: 0 },
    // Accountant-specific fields
    tallyKnowledge: { type: Boolean, default: false },
    gstKnowledge: { type: Boolean, default: false },
    payrollExperience: { type: Boolean, default: false },
    schoolAccountingExperience: { type: Boolean, default: false },
    erpExperience: { type: Boolean, default: false },
    // Receptionist-specific fields
    languagesKnown: [{ type: String, trim: true }],
    computerSkills: { type: Boolean, default: false },
    frontDeskExperience: { type: Boolean, default: false },
    communicationSkills: { type: Boolean, default: false },
    // Clerk-specific fields
    typingSpeed: { type: String, trim: true },
    msOfficeKnowledge: { type: Boolean, default: false },
    excelKnowledge: { type: Boolean, default: false },
    schoolOfficeExperience: { type: Boolean, default: false },
    // Librarian-specific fields
    libraryManagementExperience: { type: Boolean, default: false },
    librarySoftwareKnowledge: { type: Boolean, default: false },
    // Lab Assistant-specific fields
    labType: { type: String, trim: true },
    labExperience: { type: Boolean, default: false },
    // Sports Coach-specific fields
    sportsSpecialization: { type: String, trim: true },
    coachingCertificates: [{ type: String, trim: true }],
    coachingExperience: { type: Number, default: 0 },
    // Security Guard-specific fields
    securityExperience: { type: Boolean, default: false },
    exArmy: { type: Boolean, default: false },
    nightShiftAvailable: { type: Boolean, default: false },
    // Cleaner-specific fields
    cleaningExperience: { type: Boolean, default: false },
    schoolExperience: { type: Boolean, default: false },
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
