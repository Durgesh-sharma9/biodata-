import QRCode from 'qrcode';
import School from '../models/School.js';
import SchoolSettings from '../models/SchoolSettings.js';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createNotification } from '../utils/notifications.js';
// Locality master removed; area is free-text
import { generateSchoolSlug } from '../utils/slugify.js';
import { buildLocationPayload } from '../utils/location.js';

const getClientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

export const getApplicationLink = catchAsync(async (req, res) => {
  const school = await School.findById(req.schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  if (!school.slug) {
    school.slug = generateSchoolSlug(school.schoolName);
    await school.save();
  }

  const applyUrl = `${getClientUrl()}/apply/${school.slug}`;

  res.json({
    success: true,
    data: {
      slug: school.slug,
      applyUrl,
      schoolName: school.schoolName,
    },
  });
});

export const getApplicationQR = catchAsync(async (req, res) => {
  const school = await School.findById(req.schoolId);
  if (!school) throw new ApiError(404, 'School not found');

  if (!school.slug) {
    school.slug = generateSchoolSlug(school.schoolName);
    await school.save();
  }

  const applyUrl = `${getClientUrl()}/apply/${school.slug}`;
  const qrDataUrl = await QRCode.toDataURL(applyUrl, { width: 300, margin: 2 });

  res.json({
    success: true,
    data: { applyUrl, qrDataUrl },
  });
});

export const getSchoolBySlug = catchAsync(async (req, res) => {
  const school = await School.findOne({ slug: req.params.slug, isActive: true }).select(
    'schoolName slug schoolId logoUrl address city state phone email boardAffiliation schoolLevel website establishedYear aboutSchool hrContactPerson altPhone walkInTimings'
  );
  if (!school) throw new ApiError(404, 'Application link not found');

  const settings = await SchoolSettings.findOne({ schoolId: school._id }).select(
    'customWelcomeMessage autoAcknowledgeCandidates classes subjects positions qualifications'
  );

  res.json({
    success: true,
    data: {
      ...school.toObject(),
      customWelcomeMessage: settings?.customWelcomeMessage,
      settings: settings || null,
    },
  });
});

export const submitApplication = catchAsync(async (req, res) => {
  const school = await School.findOne({ slug: req.params.slug, isActive: true });
  if (!school) throw new ApiError(404, 'Application link not found');

  const {
    fullName,
    mobile,
    email,
    address,
    position,
    qualifications,
    subjects,
    classesCanTeach,
    vehicleTypes,
    experienceYears,
    expectedSalary,
    area,
    stateId,
    cityId,
    latitude,
    longitude,
    workingRadius,
    documents,
    profileSharingConsent,
    contactConsent,
  } = req.body;

  if (!fullName || !mobile || !position) {
    throw new ApiError(400, 'Full name, mobile, and position are required');
  }

  if (!profileSharingConsent || !contactConsent) {
    throw new ApiError(400, 'Consent is required to submit your application');
  }

  const locationFields = await buildLocationPayload({
    stateId,
    cityId,
    area,
    address,
    latitude,
    longitude,
    workingRadius,
  });

  const candidate = await Candidate.create({
    fullName,
    mobile: mobile.trim(),
    email,
    address: locationFields.address,
    position,
    qualifications: qualifications || [],
    subjects: subjects || [],
    classesCanTeach: classesCanTeach || [],
    vehicleTypes: vehicleTypes || [],
    experienceYears: experienceYears || 0,
    expectedSalary,
    documents: documents || [],
    profileSharingConsent: true,
    contactConsent: true,
    source: 'SCHOOL_LINK',
    ownerSchoolId: school._id,
    schoolId: school._id,
    state: locationFields.state,
    city: locationFields.city,
    area: locationFields.area,
    latitude: locationFields.latitude,
    longitude: locationFields.longitude,
  });

  // Notify school administrator if user exists
  try {
    const schoolAdmin = await User.findOne({ schoolId: school._id, role: 'school_admin' });
    if (schoolAdmin) {
      await createNotification({
        userId: schoolAdmin._id,
        type: 'candidate_application',
        title: 'New Candidate Application',
        message: `${fullName} has applied for "${position}" via your school direct application link.`,
        data: {
          schoolId: school._id,
          candidateId: candidate._id,
        },
      });
    }
  } catch (notifErr) {
    console.error('Failed to dispatch application notification:', notifErr.message);
  }

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { id: candidate._id },
  });
});
