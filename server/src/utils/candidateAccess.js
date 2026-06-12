import UnlockHistory from '../models/UnlockHistory.js';

const MONETIZED_SOURCES = ['SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'];

const CONTACT_FIELDS = ['mobile', 'email', 'whatsappNumber'];

const PREVIEW_HIDDEN_FIELDS = [
  ...CONTACT_FIELDS,
  'address',
  'notes',
  'expectedSalary',
  'documents',
];

export const getOwnerSchoolId = (candidate) =>
  candidate.ownerSchoolId || candidate.schoolId || null;

export const isOwnedBySchool = (candidate, schoolId) => {
  if (!schoolId) return false;
  const ownerId = getOwnerSchoolId(candidate);
  return ownerId && ownerId.toString() === schoolId.toString();
};

export const isMonetizedTalentPoolCandidate = (candidate) =>
  MONETIZED_SOURCES.includes(candidate.source);

export const hasFullAccess = async (candidate, schoolId) => {
  if (!schoolId) return false;
  if (isOwnedBySchool(candidate, schoolId)) return true;

  const unlock = await UnlockHistory.findOne({
    schoolId,
    candidateId: candidate._id,
  });
  return !!unlock;
};

export const isUnlockedForSchool = async (candidate, schoolId) => {
  if (isOwnedBySchool(candidate, schoolId)) return true;
  return hasFullAccess(candidate, schoolId);
};

const stripFields = (obj, fields) => {
  fields.forEach((field) => delete obj[field]);
  return obj;
};

const sanitizeSourceForSchool = (candidate) => {
  if (isMonetizedTalentPoolCandidate(candidate)) {
    return undefined;
  }
  return candidate.source;
};

export const toPreviewCandidate = (candidate) => {
  const obj = candidate.toObject ? candidate.toObject() : { ...candidate };
  stripFields(obj, PREVIEW_HIDDEN_FIELDS);
  return {
    ...obj,
    source: sanitizeSourceForSchool(candidate),
    isLocked: true,
    isContactHidden: true,
    accessLevel: 'preview',
    canEdit: false,
    canSendInterest: false,
  };
};

export const toUnlockedProfileCandidate = (candidate) => {
  const obj = candidate.toObject ? candidate.toObject() : { ...candidate };
  stripFields(obj, [...CONTACT_FIELDS, 'notes']);
  return {
    ...obj,
    source: sanitizeSourceForSchool(candidate),
    isLocked: false,
    isContactHidden: true,
    accessLevel: 'unlocked_profile',
    canEdit: false,
    canSendInterest: true,
  };
};

export const toFullCandidate = (candidate, { canEdit = false } = {}) => {
  const obj = candidate.toObject ? candidate.toObject() : { ...candidate };
  return {
    ...obj,
    source: sanitizeSourceForSchool(candidate),
    isLocked: false,
    isContactHidden: false,
    accessLevel: 'full',
    canEdit,
    canSendInterest: false,
  };
};

export const formatCandidateForSchool = async (candidate, schoolId) => {
  const canEdit = isOwnedBySchool(candidate, schoolId);

  if (canEdit) {
    return toFullCandidate(candidate, { canEdit: true });
  }

  const unlocked = await hasFullAccess(candidate, schoolId);

  if (!unlocked) {
    return toPreviewCandidate(candidate);
  }

  if (isMonetizedTalentPoolCandidate(candidate)) {
    return toUnlockedProfileCandidate(candidate);
  }

  return toFullCandidate(candidate, { canEdit: false });
};
