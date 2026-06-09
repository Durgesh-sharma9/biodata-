import mongoose from 'mongoose';

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
      required: true,
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
    notes: { type: String, trim: true },
    documents: [documentSchema],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

candidateSchema.index({ schoolId: 1, mobile: 1 });
candidateSchema.index({ schoolId: 1, fullName: 1 });
candidateSchema.index({ schoolId: 1, position: 1 });
candidateSchema.index({ schoolId: 1, createdAt: -1 });

export default mongoose.model('Candidate', candidateSchema);
