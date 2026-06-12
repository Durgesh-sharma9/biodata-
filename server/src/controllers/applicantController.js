import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';
import { resolveLocationFromLocalityId } from '../utils/locationHelper.js';

const buildCandidatePayload = async (body) => {
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
    documents,
    localityId,
    profileSharingConsent,
    contactConsent,
  } = body;

  if (!fullName || !mobile || !position) {
    throw new ApiError(400, 'Full name, mobile, and position are required');
  }

  if (!profileSharingConsent || !contactConsent) {
    throw new ApiError(400, 'Consent is required to submit your application');
  }

  let locationFields = {};
  if (localityId) {
    locationFields = await resolveLocationFromLocalityId(localityId);
  }

  return {
    fullName,
    mobile: mobile.trim(),
    email,
    address,
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
    state: locationFields.state,
    city: locationFields.city,
    locality: locationFields.locality,
  };
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  candidateId: user.candidateId,
});

export const submitPublicApplication = catchAsync(async (req, res) => {
  const payload = await buildCandidatePayload(req.body);

  const candidate = await Candidate.create({
    ...payload,
    source: 'SELF_APPLICANT',
    ownerSchoolId: null,
    schoolId: null,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { id: candidate._id },
  });
});

export const registerApplicant = catchAsync(async (req, res) => {
  const { name, email, password, profileSharingConsent, contactConsent } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  if (!profileSharingConsent || !contactConsent) {
    throw new ApiError(400, 'Both consent checkboxes must be accepted');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(400, 'Email already registered');

  let candidate = null;
  const mobile = req.body.mobile?.trim();

  if (mobile) {
    candidate = await Candidate.findOne({
      mobile,
      source: { $in: ['SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'] },
      isDeleted: false,
      applicantUserId: null,
    });
  }

  if (!candidate) {
    candidate = await Candidate.create({
      fullName: name,
      mobile: mobile || 'pending',
      source: 'SELF_APPLICANT',
      profileSharingConsent: true,
      contactConsent: true,
      position: 'Pending',
    });
  } else if (name && candidate.fullName !== name) {
    candidate.fullName = name;
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'self_applicant',
    candidateId: candidate._id,
  });

  candidate.applicantUserId = user._id;
  await candidate.save();

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: formatUser(user),
  });
});

export const getApplicantProfile = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Profile not found');

  res.json({ success: true, data: candidate });
});

export const updateApplicantProfile = catchAsync(async (req, res) => {
  const candidate = await Candidate.findOne({
    applicantUserId: req.user._id,
    isDeleted: false,
  });

  if (!candidate) throw new ApiError(404, 'Profile not found');

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
    documents,
    localityId,
    profileSharingConsent,
    contactConsent,
  } = req.body;

  if (!profileSharingConsent || !contactConsent) {
    throw new ApiError(400, 'Both consent checkboxes must be accepted to complete profile');
  }

  if (!fullName || !mobile || !position) {
    throw new ApiError(400, 'Full name, mobile, and position are required');
  }

  if (localityId) {
    const locationFields = await resolveLocationFromLocalityId(localityId);
    candidate.state = locationFields.state;
    candidate.city = locationFields.city;
    candidate.locality = locationFields.locality;
  }

  Object.assign(candidate, {
    fullName,
    mobile: mobile.trim(),
    email,
    address,
    position,
    qualifications: qualifications || [],
    subjects: subjects || [],
    classesCanTeach: classesCanTeach || [],
    vehicleTypes: vehicleTypes || [],
    experienceYears: experienceYears || 0,
    expectedSalary,
    documents: documents || candidate.documents,
    profileSharingConsent: true,
    contactConsent: true,
  });

  await candidate.save();

  if (req.body.name && req.body.name !== req.user.name) {
    req.user.name = req.body.name;
    await req.user.save();
  }

  res.json({ success: true, data: candidate });
});
