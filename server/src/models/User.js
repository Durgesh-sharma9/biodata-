import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      default: null,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { 
      type: String, 
      required: function() { return !this.googleId; }, 
      minlength: 6, 
      select: false 
    },
    googleId: { type: String, default: null, sparse: true },
    avatarUrl: { type: String, default: null },
    role: { type: String, enum: USER_ROLES, required: true },
    requestCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    activePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApplicantPlan',
      default: null,
    },
    planExpiryDate: {
      type: Date,
      default: null,
    },
    unlockedRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterestRequest',
    }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
