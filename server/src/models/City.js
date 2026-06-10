import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true, index: true },
  },
  { timestamps: true }
);

citySchema.index({ stateId: 1, name: 1 }, { unique: true });

export default mongoose.model('City', citySchema);
