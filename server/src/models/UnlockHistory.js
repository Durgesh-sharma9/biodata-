import mongoose from 'mongoose';

const unlockHistorySchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
    creditsDeducted: { type: Number, default: 1 },
  },
  { timestamps: true }
);

unlockHistorySchema.index({ schoolId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model('UnlockHistory', unlockHistorySchema);
