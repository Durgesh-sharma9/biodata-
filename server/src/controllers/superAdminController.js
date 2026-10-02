import School from '../models/School.js';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import Plan from '../models/Plan.js';
import PlatformSettings, { DEFAULT_PARTNER_SCHOOLS } from '../models/PlatformSettings.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';

export const getSuperAdminDashboard = catchAsync(async (req, res) => {
  const [totalSchools, activeSchools, totalCandidates, totalPlans, recentCandidates] =
    await Promise.all([
      School.countDocuments(),
      School.countDocuments({ isActive: true }),
      Candidate.countDocuments({ isDeleted: false }),
      Plan.countDocuments({ isActive: true }),
      Candidate.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    success: true,
    data: {
      totalSchools,
      activeSchools,
      totalCandidates,
      totalPlans,
      recentCandidates,
    },
  });
});

export const getAdmins = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};
  if (search) {
    filter.$or = [
      { schoolName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [schools, total] = await Promise.all([
    School.find(filter)
      .populate('planId', 'name credits durationDays')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    School.countDocuments(filter),
  ]);

  const admins = await Promise.all(
    schools.map(async (school) => {
      const admin = await User.findOne({ schoolId: school._id, role: 'school_admin' }).select(
        'name email'
      );
      return {
        _id: school._id,
        schoolName: school.schoolName,
        adminName: admin?.name || '-',
        email: school.email,
        adminEmail: admin?.email,
        mobile: school.phone,
        isActive: school.isActive,
        credits: school.credits || 0,
        plan: school.planId,
        subscriptionStatus: school.subscriptionStatus,
        createdAt: school.createdAt,
      };
    })
  );

  res.json({
    success: true,
    data: admins,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getMarqueeSettings = catchAsync(async (req, res) => {
  let settings = await PlatformSettings.findOne({ key: 'main_settings' });
  if (!settings) {
    settings = await PlatformSettings.create({
      key: 'main_settings',
      partnerSchools: DEFAULT_PARTNER_SCHOOLS,
      marqueeSpeed: 25,
      marqueeTitle: 'Trusted by Reputed Schools & Educational Trusts Across India',
      isActive: true,
    });
  }

  res.json({
    success: true,
    data: settings,
  });
});

export const updateMarqueeSettings = catchAsync(async (req, res) => {
  const { partnerSchools, marqueeSpeed, marqueeTitle, isActive, heroName, heroTagline } = req.body;

  const updateData = {};
  if (Array.isArray(partnerSchools)) {
    updateData.partnerSchools = partnerSchools
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter((s) => s.length > 0);
  }
  if (typeof marqueeSpeed === 'number' && marqueeSpeed >= 5 && marqueeSpeed <= 120) {
    updateData.marqueeSpeed = Math.round(marqueeSpeed);
  }
  if (typeof marqueeTitle === 'string') {
    updateData.marqueeTitle = marqueeTitle.trim();
  }
  if (typeof heroName === 'string' && heroName.trim().length > 0) {
    updateData.heroName = heroName.trim();
  }
  if (typeof heroTagline === 'string' && heroTagline.trim().length > 0) {
    updateData.heroTagline = heroTagline.trim();
  }
  if (typeof isActive === 'boolean') {
    updateData.isActive = isActive;
  }

  const settings = await PlatformSettings.findOneAndUpdate(
    { key: 'main_settings' },
    { $set: updateData },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    message: 'Marquee settings updated successfully',
    data: settings,
  });
});

export const impersonateSchool = catchAsync(async (req, res) => {
  const { schoolId } = req.params;

  const school = await School.findById(schoolId);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }

  // Find school_admin user for this school
  let user = await User.findOne({ schoolId: school._id, role: 'school_admin' });
  if (!user) {
    user = await User.findOne({ email: school.email.toLowerCase() });
  }

  if (!user) {
    // If no user exists, create a default school_admin user for this school
    user = await User.create({
      name: school.schoolName ? `${school.schoolName} Admin` : 'School Admin',
      email: school.email.toLowerCase(),
      password: Math.random().toString(36).slice(-10),
      role: 'school_admin',
      schoolId: school._id,
    });
  }

  // Generate valid token for the school admin
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: `Stealth session active for ${school.schoolName}`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: school._id,
      avatarUrl: user.avatarUrl,
    },
    school: {
      _id: school._id,
      schoolName: school.schoolName,
      email: school.email,
      phone: school.phone,
      logoUrl: school.logoUrl,
      subscriptionPlan: school.subscriptionPlan,
      credits: school.credits,
    },
  });
});

export const getSchoolDetailsWithCandidates = catchAsync(async (req, res) => {
  const { id } = req.params;

  const school = await School.findById(id).populate('planId', 'name price credits durationDays');
  if (!school) {
    throw new ApiError(404, 'School not found');
  }

  const [admin, candidates] = await Promise.all([
    User.findOne({ schoolId: school._id, role: 'school_admin' }).select('name email phone mobile'),
    Candidate.find({
      $or: [{ schoolId: school._id }, { ownerSchoolId: school._id }],
      isDeleted: false,
    })
      .select('fullName mobile email position experienceYears expectedSalary status city state area address source subjects qualifications classesCanTeach createdAt')
      .sort({ createdAt: -1 }),
  ]);

  const stats = {
    total: candidates.length,
    hired: candidates.filter((c) => c.status === 'hired').length,
    shortlisted: candidates.filter((c) => c.status === 'shortlisted').length,
    interviewScheduled: candidates.filter((c) => c.status === 'interview_scheduled').length,
    new: candidates.filter((c) => c.status === 'new').length,
    offered: candidates.filter((c) => c.status === 'offered').length,
    rejected: candidates.filter((c) => c.status === 'rejected').length,
  };

  res.json({
    success: true,
    data: {
      school,
      admin,
      candidates,
      stats,
    },
  });
});

export const getAllCandidatesForExport = catchAsync(async (req, res) => {
  const { schoolId, schoolIds } = req.query;

  const filter = { isDeleted: false };
  if (schoolIds) {
    const ids = Array.isArray(schoolIds) ? schoolIds : String(schoolIds).split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length > 0) {
      filter.$or = [
        { schoolId: { $in: ids } },
        { ownerSchoolId: { $in: ids } },
      ];
    }
  } else if (schoolId) {
    filter.$or = [{ schoolId }, { ownerSchoolId: schoolId }];
  }

  const candidates = await Candidate.find(filter)
    .populate('schoolId', 'schoolName email phone city state')
    .populate('ownerSchoolId', 'schoolName email phone city state')
    .select('fullName mobile email position experienceYears expectedSalary status city state area address source subjects qualifications classesCanTeach createdAt schoolId ownerSchoolId')
    .sort({ createdAt: -1 })
    .limit(10000);

  const formatted = candidates.map((c) => {
    const school = c.schoolId || c.ownerSchoolId;
    return {
      _id: c._id,
      fullName: c.fullName,
      mobile: c.mobile,
      email: c.email || '',
      position: c.position,
      experienceYears: c.experienceYears || 0,
      expectedSalary: c.expectedSalary || 0,
      status: c.status || 'new',
      city: c.city || '',
      state: c.state || '',
      area: c.area || '',
      address: c.address || '',
      source: c.source || 'ADMIN',
      subjects: Array.isArray(c.subjects) ? c.subjects.join(', ') : '',
      qualifications: Array.isArray(c.qualifications) ? c.qualifications.join(', ') : '',
      classesCanTeach: Array.isArray(c.classesCanTeach) ? c.classesCanTeach.join(', ') : '',
      schoolName: school?.schoolName || 'Platform General Pool',
      schoolEmail: school?.email || '',
      createdAt: c.createdAt,
    };
  });

  res.json({
    success: true,
    data: formatted,
    total: formatted.length,
  });
});

