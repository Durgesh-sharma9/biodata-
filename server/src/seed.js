import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import School from './models/School.js';
import SchoolSettings from './models/SchoolSettings.js';
import Candidate from './models/Candidate.js';
import Plan from './models/Plan.js';
import CreditPackage from './models/CreditPackage.js';
import ApplicantPlan from './models/ApplicantPlan.js';
import { generateSchoolSlug } from './utils/slugify.js';

const seed = async () => {
  await connectDB();

  // 1. Super Admin
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@platform.com';
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  const existingAdmin = await User.findOne({ email: adminEmail, role: 'super_admin' });
  if (!existingAdmin) {
    await User.create({ name: adminName, email: adminEmail, password: adminPassword, role: 'super_admin' });
    console.log('Super admin created:', adminEmail);
  } else {
    existingAdmin.password = adminPassword;
    await existingAdmin.save();
    console.log('Super admin password updated:', adminEmail);
  }

  // 2. Demo School & School Admin User
  const schoolEmail = 'school@demo.com';
  const schoolPassword = 'School@123';
  const schoolName = 'Greenwood Public School';

  let school = await School.findOne({ email: schoolEmail });
  if (!school) {
    const trialExpiryDate = new Date();
    trialExpiryDate.setDate(trialExpiryDate.getDate() + 90);
    school = await School.create({
      schoolId: 'SCH-DEMO01',
      schoolName,
      email: schoolEmail,
      phone: '9876543210',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Connaught Place',
      address: '123 Education Lane, Connaught Place, New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      workingRadius: 50,
      slug: generateSchoolSlug(schoolName),
      subscriptionPlan: 'premium',
      subscriptionStatus: 'active',
      startDate: new Date(),
      expiryDate: trialExpiryDate,
      isActive: true,
      credits: 50,
    });
    await SchoolSettings.create({ schoolId: school._id });
    console.log('Demo School created:', schoolName);
  } else {
    school.latitude = 28.6139;
    school.longitude = 77.2090;
    school.workingRadius = 50;
    await school.save();
    console.log('Demo School location updated:', schoolName);
  }

  let schoolUser = await User.findOne({ email: schoolEmail });
  if (!schoolUser) {
    schoolUser = await User.create({
      schoolId: school._id,
      name: 'School Principal',
      email: schoolEmail,
      password: schoolPassword,
      role: 'school_admin',
    });
    console.log('Demo School Admin created:', schoolEmail);
  } else {
    schoolUser.password = schoolPassword;
    schoolUser.schoolId = school._id;
    await schoolUser.save();
    console.log('Demo School Admin password updated:', schoolEmail);
  }

  // Rich Demo School Candidates (Owned by Greenwood Public School)
  const schoolCandidates = [
    {
      fullName: 'Anita Verma',
      mobile: '9871112233',
      email: 'anita.verma@example.com',
      gender: 'Female',
      position: 'Teacher',
      qualifications: ['B.Ed', 'MA'],
      subjects: ['English', 'Social Science'],
      classesCanTeach: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
      experienceYears: 4,
      expectedSalary: 35000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Connaught Place',
      latitude: 28.6289,
      longitude: 77.2190,
      medium: 'English',
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Vikram Singh',
      mobile: '9872223344',
      email: 'vikram.singh@example.com',
      gender: 'Male',
      position: 'Driver',
      qualifications: ['10th'],
      vehicleTypes: ['School Bus', 'Van'],
      drivingExperience: 7,
      experienceYears: 7,
      expectedSalary: 22000,
      heavyVehicle: true,
      schoolBusExperience: true,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Connaught Place',
      latitude: 28.6300,
      longitude: 77.2150,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Pooja Malhotra',
      mobile: '9873334455',
      email: 'pooja.m@example.com',
      gender: 'Female',
      position: 'Accountant',
      qualifications: ['BCom', 'MCom'],
      tallyKnowledge: true,
      gstKnowledge: true,
      payrollExperience: true,
      experienceYears: 6,
      expectedSalary: 38000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Connaught Place',
      latitude: 28.6315,
      longitude: 77.2180,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Rohan Kapoor',
      mobile: '9874445566',
      email: 'rohan.k@example.com',
      gender: 'Male',
      position: 'Teacher',
      qualifications: ['BCA', 'MCA'],
      subjects: ['Computer Science', 'Information Technology'],
      classesCanTeach: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
      experienceYears: 3,
      expectedSalary: 40000,
      medium: 'English',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Rohini',
      latitude: 28.7041,
      longitude: 77.1025,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Sunita Yadav',
      mobile: '9875556677',
      email: 'sunita.y@example.com',
      gender: 'Female',
      position: 'Receptionist',
      qualifications: ['BA'],
      languagesKnown: ['English', 'Hindi'],
      computerSkills: true,
      frontDeskExperience: true,
      experienceYears: 2,
      expectedSalary: 25000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Lajpat Nagar',
      latitude: 28.5677,
      longitude: 77.2433,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Manish Kumar',
      mobile: '9876667788',
      email: 'manish.sports@example.com',
      gender: 'Male',
      position: 'Sports Coach',
      qualifications: ['B.Ed', 'BA'],
      sportsSpecialization: 'Cricket & Basketball',
      coachingExperience: 5,
      experienceYears: 5,
      expectedSalary: 32000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Dwarka',
      latitude: 28.5921,
      longitude: 77.0460,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Deepak Sharma',
      mobile: '9877778899',
      email: 'deepak.lab@example.com',
      gender: 'Male',
      position: 'Lab Assistant',
      qualifications: ['BSc'],
      labType: 'Chemistry & Physics',
      labExperience: true,
      experienceYears: 4,
      expectedSalary: 24000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Janakpuri',
      latitude: 28.6219,
      longitude: 77.0878,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Rajesh Gupta',
      mobile: '9878889900',
      email: 'rajesh.guard@example.com',
      gender: 'Male',
      position: 'Security Guard',
      qualifications: ['10th'],
      securityExperience: true,
      exArmy: true,
      nightShiftAvailable: true,
      experienceYears: 8,
      expectedSalary: 18000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Mayur Vihar',
      latitude: 28.6080,
      longitude: 77.2940,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Meena Devi',
      mobile: '9879990011',
      email: 'meena.d@example.com',
      gender: 'Female',
      position: 'Teacher',
      qualifications: ['BTC', 'D.El.Ed'],
      subjects: ['Hindi', 'Mathematics'],
      classesCanTeach: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
      experienceYears: 5,
      expectedSalary: 28000,
      medium: 'Hindi',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Karol Bagh',
      latitude: 28.6517,
      longitude: 77.1906,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Sanjay Rastogi',
      mobile: '9870001122',
      email: 'sanjay.lib@example.com',
      gender: 'Male',
      position: 'Librarian',
      qualifications: ['BA', 'B.Ed'],
      libraryManagementExperience: true,
      librarySoftwareKnowledge: true,
      experienceYears: 6,
      expectedSalary: 30000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Pitampura',
      latitude: 28.6990,
      longitude: 77.1384,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Priyanka Roy',
      mobile: '9870011223',
      email: 'priyanka.roy@example.com',
      gender: 'Female',
      position: 'Teacher',
      qualifications: ['B.Ed', 'M.Ed', 'MA'],
      subjects: ['English', 'History', 'Civics'],
      classesCanTeach: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
      experienceYears: 8,
      expectedSalary: 42000,
      medium: 'English',
      boardExperience: ['CBSE', 'ICSE'],
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Vasant Vihar',
      latitude: 28.5600,
      longitude: 77.1600,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Harminder Singh',
      mobile: '9870022334',
      email: 'harminder.driver@example.com',
      gender: 'Male',
      position: 'Driver',
      qualifications: ['10th'],
      vehicleTypes: ['School Bus', 'Heavy Vehicle'],
      drivingExperience: 10,
      experienceYears: 10,
      expectedSalary: 25000,
      heavyVehicle: true,
      schoolBusExperience: true,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Paschim Vihar',
      latitude: 28.6700,
      longitude: 77.1100,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Vikas Joshi',
      mobile: '9870033445',
      email: 'vikas.acc@example.com',
      gender: 'Male',
      position: 'Accountant',
      qualifications: ['BCom', 'MCom'],
      tallyKnowledge: true,
      gstKnowledge: true,
      payrollExperience: true,
      erpExperience: true,
      experienceYears: 5,
      expectedSalary: 36000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'South Ext',
      latitude: 28.5700,
      longitude: 77.2200,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Shweta Sharma',
      mobile: '9870044556',
      email: 'shweta.reception@example.com',
      gender: 'Female',
      position: 'Receptionist',
      qualifications: ['BA', 'BBA'],
      languagesKnown: ['English', 'Hindi'],
      computerSkills: true,
      frontDeskExperience: true,
      communicationSkills: true,
      experienceYears: 3,
      expectedSalary: 26000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Saket',
      latitude: 28.5200,
      longitude: 77.2100,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Aman Preet Singh',
      mobile: '9870055667',
      email: 'aman.coach@example.com',
      gender: 'Male',
      position: 'Sports Coach',
      qualifications: ['BPEd', 'NIS'],
      sportsSpecialization: 'Football',
      coachingCertificates: ['NIS', 'BPEd'],
      coachingExperience: 6,
      experienceYears: 6,
      expectedSalary: 34000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Mayur Vihar Ph 1',
      latitude: 28.6100,
      longitude: 77.2900,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
    {
      fullName: 'Neelam Saxena',
      mobile: '9870066778',
      email: 'neelam.clerk@example.com',
      gender: 'Female',
      position: 'Clerk',
      qualifications: ['BA'],
      typingSpeed: 'Fast',
      msOfficeKnowledge: true,
      excelKnowledge: true,
      experienceYears: 4,
      expectedSalary: 23000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Kirti Nagar',
      latitude: 28.6500,
      longitude: 77.1400,
      source: 'ADMIN',
      ownerSchoolId: school._id,
      schoolId: school._id,
    },
  ];

  for (const candData of schoolCandidates) {
    const existingCand = await Candidate.findOne({ mobile: candData.mobile });
    if (!existingCand) {
      await Candidate.create(candData);
    } else {
      Object.assign(existingCand, candData);
      await existingCand.save();
    }
  }
  console.log('Rich Demo School Candidates seeded:', schoolCandidates.length);

  // 3. Demo Self Applicant (Candidate User) & Talent Pool Records
  const applicantEmail = 'applicant@demo.com';
  const applicantPassword = 'Applicant@123';
  const applicantMobile = '9812345678';
  const applicantName = 'Rahul Sharma';

  let applicantCandidate = await Candidate.findOne({ mobile: applicantMobile });
  if (!applicantCandidate) {
    applicantCandidate = await Candidate.create({
      fullName: applicantName,
      mobile: applicantMobile,
      email: applicantEmail,
      gender: 'Male',
      position: 'Teacher',
      qualifications: ['B.Ed', 'MSc'],
      subjects: ['Mathematics', 'Physics'],
      classesCanTeach: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
      experienceYears: 5,
      expectedSalary: 45000,
      medium: 'English',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'South Delhi',
      address: '45 Saket Sector 3, South Delhi',
      latitude: 28.5244,
      longitude: 77.2188,
      source: 'SELF_APPLICANT',
      profileSharingConsent: true,
      contactConsent: true,
    });
    console.log('Demo Self Applicant Candidate created:', applicantName);
  } else {
    applicantCandidate.latitude = 28.5244;
    applicantCandidate.longitude = 77.2188;
    await applicantCandidate.save();
  }

  let applicantUser = await User.findOne({ email: applicantEmail });
  if (!applicantUser) {
    applicantUser = await User.create({
      candidateId: applicantCandidate._id,
      name: applicantName,
      email: applicantEmail,
      password: applicantPassword,
      role: 'self_applicant',
    });
    console.log('Demo Self Applicant User created:', applicantEmail);
  } else {
    applicantUser.password = applicantPassword;
    applicantUser.candidateId = applicantCandidate._id;
    await applicantUser.save();
  }

  if (!applicantCandidate.applicantUserId) {
    applicantCandidate.applicantUserId = applicantUser._id;
    await applicantCandidate.save();
  }

  // Additional Talent Pool Candidates
  const talentPoolCandidates = [
    {
      fullName: 'Kavita Joshi',
      mobile: '9811122334',
      email: 'kavita.j@example.com',
      gender: 'Female',
      position: 'Teacher',
      qualifications: ['BA', 'D.El.Ed'],
      subjects: ['Hindi', 'Drawing'],
      classesCanTeach: ['Nursery', 'LKG', 'UKG', 'Class 1'],
      experienceYears: 3,
      expectedSalary: 22000,
      medium: 'Hindi',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Vasant Kunj',
      latitude: 28.5293,
      longitude: 77.1539,
      source: 'SELF_APPLICANT',
      profileSharingConsent: true,
      contactConsent: true,
    },
    {
      fullName: 'Amitabh Sen',
      mobile: '9812233445',
      email: 'amitabh.sen@example.com',
      gender: 'Male',
      position: 'Teacher',
      qualifications: ['MSc', 'B.Ed'],
      subjects: ['Mathematics', 'Economics'],
      classesCanTeach: ['Class 10', 'Class 11', 'Class 12'],
      experienceYears: 10,
      expectedSalary: 55000,
      medium: 'English',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Noida Border',
      latitude: 28.5800,
      longitude: 77.3100,
      source: 'SUPER_ADMIN_IMPORT',
      profileSharingConsent: true,
      contactConsent: true,
    },
    {
      fullName: 'Neha Gupta',
      mobile: '9813344556',
      email: 'neha.g@example.com',
      gender: 'Female',
      position: 'Teacher',
      qualifications: ['MSc', 'B.Ed'],
      subjects: ['Chemistry', 'Biology'],
      classesCanTeach: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
      experienceYears: 6,
      expectedSalary: 48000,
      medium: 'English',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Greater Kailash',
      latitude: 28.5468,
      longitude: 77.2415,
      source: 'SELF_APPLICANT',
      profileSharingConsent: true,
      contactConsent: true,
    },
    {
      fullName: 'Rakesh Meena',
      mobile: '9814455667',
      email: 'rakesh.m@example.com',
      gender: 'Male',
      position: 'Accountant',
      qualifications: ['MCom'],
      tallyKnowledge: true,
      gstKnowledge: true,
      payrollExperience: true,
      experienceYears: 7,
      expectedSalary: 42000,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Okhla',
      latitude: 28.5308,
      longitude: 77.2711,
      source: 'SUPER_ADMIN_IMPORT',
      profileSharingConsent: true,
      contactConsent: true,
    },
    {
      fullName: 'Harpreet Kaur',
      mobile: '9815566778',
      email: 'harpreet.k@example.com',
      gender: 'Female',
      position: 'Teacher',
      qualifications: ['MA'],
      subjects: ['Music', 'Drawing'],
      classesCanTeach: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
      experienceYears: 4,
      expectedSalary: 30000,
      medium: 'English',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Tilak Nagar',
      latitude: 28.6367,
      longitude: 77.0964,
      source: 'SELF_APPLICANT',
      profileSharingConsent: true,
      contactConsent: true,
    },
    {
      fullName: 'Suresh Chand',
      mobile: '9816677889',
      email: 'suresh.driver@example.com',
      gender: 'Male',
      position: 'Driver',
      qualifications: ['10th'],
      vehicleTypes: ['School Bus', 'Heavy Vehicle'],
      drivingExperience: 12,
      experienceYears: 12,
      expectedSalary: 26000,
      heavyVehicle: true,
      schoolBusExperience: true,
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Shahdara',
      latitude: 28.6732,
      longitude: 77.2872,
      source: 'SUPER_ADMIN_IMPORT',
      profileSharingConsent: true,
      contactConsent: true,
    },
  ];

  for (const tpData of talentPoolCandidates) {
    const existingTP = await Candidate.findOne({ mobile: tpData.mobile });
    if (!existingTP) {
      await Candidate.create(tpData);
    } else {
      Object.assign(existingTP, tpData);
      await existingTP.save();
    }
  }
  console.log('Talent Pool Candidates seeded:', talentPoolCandidates.length);

  // 4. Default Plans
  const defaultPlans = [
    { name: 'Starter', credits: 10, durationDays: 30 },
    { name: 'Professional', credits: 50, durationDays: 30 },
    { name: 'Premium', credits: 200, durationDays: 90 },
  ];

  for (const plan of defaultPlans) {
    await Plan.findOneAndUpdate({ name: plan.name }, plan, { upsert: true });
  }
  console.log('Default plans seeded');

  // 5. Default Credit Packages
  const defaultPackages = [
    { name: '10 Credits', credits: 10 },
    { name: '50 Credits', credits: 50 },
    { name: '100 Credits', credits: 100 },
    { name: '200 Credits', credits: 200 },
  ];

  for (const pkg of defaultPackages) {
    await CreditPackage.findOneAndUpdate({ name: pkg.name }, pkg, { upsert: true });
  }
  console.log('Default credit packages seeded');

  // 6. Default Applicant Plans
  const defaultApplicantPlans = [
    {
      name: 'Free Plan',
      price: 0,
      durationDays: 365,
      features: ['Create Profile', 'Upload Resume', 'Receive Requests'],
    },
    {
      name: 'Basic Plan',
      price: 49,
      durationDays: 30,
      features: ['View School Details', 'View School Contact', 'Contact School'],
    },
    {
      name: 'Premium Plan',
      price: 99,
      durationDays: 90,
      features: ['View School Details', 'View School Contact', 'Contact School', 'Priority Support'],
    },
  ];

  for (const plan of defaultApplicantPlans) {
    await ApplicantPlan.findOneAndUpdate({ name: plan.name }, plan, { upsert: true });
  }
  console.log('Default applicant plans seeded');

  console.log('\n--- SEED COMPLETE ---');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
