import mongoose from 'mongoose';

const interestRequestSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    schoolName: { type: String, required: true, trim: true },
    positionOffered: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'viewed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

interestRequestSchema.index({ schoolId: 1, candidateId: 1 }, { unique: true });
interestRequestSchema.index({ candidateId: 1, createdAt: -1 });

export default mongoose.model('InterestRequest', interestRequestSchema);
