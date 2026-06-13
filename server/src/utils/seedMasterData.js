import ApplicantPlan from '../models/ApplicantPlan.js';
import Position from '../models/Position.js';
import Subject from '../models/Subject.js';
import Qualification from '../models/Qualification.js';
import Class from '../models/Class.js';

const DEFAULT_POSITIONS = [
  'Teacher',
  'Driver',
  'Accountant',
  'Receptionist',
  'Clerk',
  'Librarian',
  'Lab Assistant',
  'Sports Coach',
  'Security Guard',
  'Cleaner',
  'Counsellor',
  'Nurse',
  'Office Assistant',
  'Principal',
  'Vice Principal',
  'Coordinator',
];

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Sanskrit',
  'Social Science',
  'History',
  'Geography',
  'Political Science',
  'Economics',
  'Computer Science',
  'Information Technology',
  'Physical Education',
  'Drawing',
  'Music',
  'GK',
  'Reasoning',
];

const DEFAULT_QUALIFICATIONS = [
  '10th',
  '12th',
  'BA',
  'BCom',
  'BSc',
  'MA',
  'MCom',
  'MSc',
  'BCA',
  'MCA',
  'BBA',
  'MBA',
  'B.Ed',
  'M.Ed',
  'D.El.Ed',
  'BSTC',
  'BTC',
  'B.Tech',
  'M.Tech',
  'ITI',
  'Diploma',
  'CA',
  'CS',
  'PhD',
];

const DEFAULT_CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

const DEFAULT_APPLICANT_PLANS = [
  // Request-Based Plans
  {
    name: 'Single Unlock',
    planType: 'REQUEST_BASED',
    price: 49,
    requestCount: 1,
    features: ['Unlock 1 school request', 'Permanent access to unlocked school', 'View school contact details'],
    isActive: true,
  },
  {
    name: 'Starter Pack',
    planType: 'REQUEST_BASED',
    price: 99,
    requestCount: 3,
    features: ['Unlock 3 school requests', 'Permanent access to unlocked schools', 'View school contact details'],
    isActive: true,
  },
  {
    name: 'Growth Pack',
    planType: 'REQUEST_BASED',
    price: 249,
    requestCount: 10,
    features: ['Unlock 10 school requests', 'Permanent access to unlocked schools', 'View school contact details', 'Best value'],
    isActive: true,
  },
  // Unlimited Plans
  {
    name: 'Premium Monthly',
    planType: 'UNLIMITED',
    price: 299,
    durationDays: 30,
    features: ['Unlimited unlocks for 30 days', 'View all school contacts', 'No credit deduction'],
    isActive: true,
  },
  {
    name: 'Premium Quarterly',
    planType: 'UNLIMITED',
    price: 699,
    durationDays: 90,
    features: ['Unlimited unlocks for 90 days', 'View all school contacts', 'No credit deduction', 'Save 22%'],
    isActive: true,
  },
  {
    name: 'Premium Yearly',
    planType: 'UNLIMITED',
    price: 1999,
    durationDays: 365,
    features: ['Unlimited unlocks for 365 days', 'View all school contacts', 'No credit deduction', 'Best value - Save 44%'],
    isActive: true,
  },
];

export async function seedMasterData() {
  console.log('🌱 Starting master data seeding...');

  try {
    // Seed Positions
    const existingPositions = await Position.countDocuments();
    console.log(`📊 Positions in database: ${existingPositions}`);
    if (existingPositions === 0) {
      console.log('📝 Seeding positions...');
      await Position.insertMany(
        DEFAULT_POSITIONS.map((name) => ({ name, isActive: true }))
      );
      console.log(`✅ Seeded ${DEFAULT_POSITIONS.length} positions`);
    } else {
      console.log(`⏭️ Positions already exist (${existingPositions} records)`);
    }

    // Seed Subjects
    const existingSubjects = await Subject.countDocuments();
    console.log(`📊 Subjects in database: ${existingSubjects}`);
    if (existingSubjects === 0) {
      console.log('📝 Seeding subjects...');
      await Subject.insertMany(
        DEFAULT_SUBJECTS.map((name) => ({ name, isActive: true }))
      );
      console.log(`✅ Seeded ${DEFAULT_SUBJECTS.length} subjects`);
    } else {
      console.log(`⏭️ Subjects already exist (${existingSubjects} records)`);
    }

    // Seed Qualifications
    const existingQualifications = await Qualification.countDocuments();
    console.log(`📊 Qualifications in database: ${existingQualifications}`);
    if (existingQualifications === 0) {
      console.log('📝 Seeding qualifications...');
      await Qualification.insertMany(
        DEFAULT_QUALIFICATIONS.map((name) => ({ name, isActive: true }))
      );
      console.log(`✅ Seeded ${DEFAULT_QUALIFICATIONS.length} qualifications`);
    } else {
      console.log(`⏭️ Qualifications already exist (${existingQualifications} records)`);
    }

    // Seed Classes
    const existingClasses = await Class.countDocuments();
    console.log(`📊 Classes in database: ${existingClasses}`);
    if (existingClasses === 0) {
      console.log('📝 Seeding classes...');
      await Class.insertMany(
        DEFAULT_CLASSES.map((name) => ({ name, isActive: true }))
      );
      console.log(`✅ Seeded ${DEFAULT_CLASSES.length} classes`);
    } else {
      console.log(`⏭️ Classes already exist (${existingClasses} records)`);
    }

    // Seed Applicant Plans
    const existingApplicantPlans = await ApplicantPlan.countDocuments();
    console.log(`📊 Applicant Plans in database: ${existingApplicantPlans}`);
    if (existingApplicantPlans === 0) {
      console.log('📝 Seeding applicant plans...');
      await ApplicantPlan.insertMany(DEFAULT_APPLICANT_PLANS);
      console.log(`✅ Seeded ${DEFAULT_APPLICANT_PLANS.length} applicant plans`);
    } else {
      console.log(`⏭️ Applicant Plans already exist (${existingApplicantPlans} records)`);
    }

    console.log('✨ Master data seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding master data:', error);
    throw error;
  }
}
