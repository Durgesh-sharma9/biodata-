import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';
import { resolveLocationFromLocalityId } from '../utils/locationHelper.js';

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  candidateId: user.candidateId,
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

  const candidate = await Candidate.create({
    fullName: name,
    mobile: req.body.mobile || 'pending',
    source: 'SELF_APPLICANT',
    profileSharingConsent: true,
    contactConsent: true,
    position: 'Pending',
  });

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
    candidate.localityCluster = locationFields.localityCluster;
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
