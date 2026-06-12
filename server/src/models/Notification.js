import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['interest_request'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    data: {
      interestRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterestRequest' },
      schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
      candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    },
    isRead: { type: Boolean, default: false, index: true },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
