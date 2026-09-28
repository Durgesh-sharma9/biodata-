import mongoose from 'mongoose';
import {
  DEFAULT_POSITIONS,
  DEFAULT_SUBJECTS,
  DEFAULT_CLASSES,
  DEFAULT_QUALIFICATIONS,
} from '../config/constants.js';

const schoolSettingsSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      unique: true,
      index: true,
    },
    positions: { type: [String], default: () => [...DEFAULT_POSITIONS] },
    subjects: { type: [String], default: () => [...DEFAULT_SUBJECTS] },
    qualifications: { type: [String], default: () => [...DEFAULT_QUALIFICATIONS] },
    classes: { type: [String], default: () => [...DEFAULT_CLASSES] },
    // Hiring & Portal Preferences
    isActivelyHiring: { type: Boolean, default: true },
    allowWalkInApplications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    whatsappAlerts: { type: Boolean, default: false },
    dailyDigest: { type: Boolean, default: true },
    autoAcknowledgeCandidates: { type: Boolean, default: true },
    customWelcomeMessage: { 
      type: String, 
      default: 'Thank you for applying to our school. Our recruitment team will review your application soon.' 
    },
    contactWorkingHours: { type: String, default: '09:00 AM - 04:00 PM' },
    preferredExperienceMin: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('SchoolSettings', schoolSettingsSchema);
