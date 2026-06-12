import { z } from 'zod';

export const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  mobile: z
    .string()
    .min(10, 'Valid mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  qualifications: z.array(z.string()).default([]),
  subjects: z.array(z.string()).default([]),
  classesCanTeach: z.array(z.string()).default([]),
  vehicleTypes: z.array(z.string()).default([]),
  experienceYears: z.coerce.number().min(0, 'Experience cannot be negative').default(0),
  expectedSalary: z.coerce.number().min(0, 'Salary cannot be negative').optional(),
  localityId: z.string().optional(),
  notes: z.string().optional(),
  profileSharingConsent: z.boolean().optional(),
  contactConsent: z.boolean().optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string().optional(),
      })
    )
    .max(10, 'Maximum 10 documents allowed')
    .default([]),
});

export const publicApplicationSchema = candidateSchema.extend({
  profileSharingConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to share your profile with schools' }),
  }),
  contactConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted by schools' }),
  }),
});

export const VEHICLE_TYPES = ['School Bus', 'Car', 'Van', 'Heavy Vehicle'];
export const TEACHING_POSITIONS = ['Teacher', 'Sports Coach'];
export const SUBJECT_POSITIONS = ['Teacher', 'Sports Coach', 'Librarian', 'Lab Assistant'];
export const CLASS_POSITIONS = ['Teacher', 'Sports Coach'];
export const DRIVER_POSITIONS = ['Driver'];
