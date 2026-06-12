import mongoose from 'mongoose';

const localitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true, index: true },
  },
  { timestamps: true }
);

localitySchema.index({ cityId: 1, name: 1 }, { unique: true });

export default mongoose.model('Locality', localitySchema);
