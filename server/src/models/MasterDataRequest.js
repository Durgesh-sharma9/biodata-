import mongoose from 'mongoose';

const masterDataRequestSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['position', 'subject', 'qualification', 'class'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('MasterDataRequest', masterDataRequestSchema);
