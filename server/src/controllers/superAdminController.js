import School from '../models/School.js';
import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import Plan from '../models/Plan.js';
import PlatformSettings, { DEFAULT_PARTNER_SCHOOLS } from '../models/PlatformSettings.js';
import { catchAsync } from '../utils/catchAsync.js';

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
