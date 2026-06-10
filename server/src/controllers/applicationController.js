import QRCode from 'qrcode';
import School from '../models/School.js';
import Candidate from '../models/Candidate.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { resolveLocationFromLocalityId } from '../utils/locationHelper.js';
import { generateSchoolSlug } from '../utils/slugify.js';

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
    'schoolName slug schoolId'
  );
  if (!school) throw new ApiError(404, 'Application link not found');
  res.json({ success: true, data: school });
});

export const submitApplication = catchAsync(async (req, res) => {
  const school = await School.findOne({ slug: req.params.slug, isActive: true });
  if (!school) throw new ApiError(404, 'Application link not found');

  const { fullName, mobile, email, address, position, qualifications, experienceYears, expectedSalary, localityId, documents } =
    req.body;

  if (!fullName || !mobile || !position) {
    throw new ApiError(400, 'Full name, mobile, and position are required');
  }

  let locationFields = {};
  if (localityId) {
    locationFields = await resolveLocationFromLocalityId(localityId);
  }

  const candidate = await Candidate.create({
    fullName,
    mobile: mobile.trim(),
    email,
    address,
    position,
    qualifications: qualifications || [],
    experienceYears: experienceYears || 0,
    expectedSalary,
    documents: documents || [],
    source: 'SCHOOL_LINK',
    ownerSchoolId: school._id,
    schoolId: school._id,
    state: locationFields.state,
    city: locationFields.city,
    locality: locationFields.locality,
    localityCluster: locationFields.localityCluster,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { id: candidate._id },
  });
});
