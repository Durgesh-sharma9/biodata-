import mongoose from 'mongoose';

const localityClusterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true, index: true },
  },
  { timestamps: true }
);

localityClusterSchema.index({ cityId: 1, name: 1 }, { unique: true });

export default mongoose.model('LocalityCluster', localityClusterSchema);
