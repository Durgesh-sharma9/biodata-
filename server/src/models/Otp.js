import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['password_reset', 'email_verification', 'login_otp'],
      default: 'password_reset',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '10m' }, // Auto delete after 10 minutes
    },
  },
  { timestamps: true }
);

export default mongoose.model('Otp', otpSchema);
