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
  },
  { timestamps: true }
);

export default mongoose.model('SchoolSettings', schoolSettingsSchema);
