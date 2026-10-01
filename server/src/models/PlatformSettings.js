import mongoose from 'mongoose';

export const DEFAULT_PARTNER_SCHOOLS = [
  'Delhi Public School (DPS)',
  'Cambridge International School',
  'Ryan International Group',
  "St. Xavier's Senior Secondary School",
  'DAV Public School',
  'Birla Public School',
  'Heritage Global Academy',
  'Army Public School',
  'Podar International School',
  'Mount Litera Zee School',
];

const platformSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_settings',
      unique: true,
    },
    partnerSchools: {
      type: [String],
      default: DEFAULT_PARTNER_SCHOOLS,
    },
    marqueeSpeed: {
      type: Number,
      default: 25,
      min: 5,
      max: 120,
    },
    marqueeTitle: {
      type: String,
      default: 'Trusted by Reputed Schools & Educational Trusts Across India',
    },
    heroName: {
      type: String,
      default: 'HireHub',
    },
    heroTagline: {
      type: String,
      default: 'eliminates paper biodatas and agency commissions. Generate a custom QR code for gate walk-ins, organize applicants into a searchable digital vault, and dispatch 1-click WhatsApp interview invitations.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PlatformSettings', platformSettingsSchema);
