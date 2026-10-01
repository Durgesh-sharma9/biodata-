import mongoose from 'mongoose';

export const DEFAULT_PARTNER_SCHOOLS = [
  'Sunrise International School',
  'Global Wisdom Public School',
  'Bright Horizon Academy',
  'Mayur Senior Secondary School',
  'Springdale International School',
  'Pragati Educational Academy',
  'Gyan Sagar Public School',
  'Greenwood Valley School',
  'Vidyasthali Memorial School',
  'Apex International Academy',
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
      default: 'eliminates paper biodatas and agency commissions. Generate a custom QR code for gate walk-ins, organize applicants into a searchable digital vault, and streamline school staff recruitment.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PlatformSettings', platformSettingsSchema);
