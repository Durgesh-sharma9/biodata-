import UnlockHistory from '../models/UnlockHistory.js';

const SENSITIVE_FIELDS = [
  'mobile',
  'email',
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

export const hasFullAccess = async (candidate, schoolId) => {
  if (!schoolId) return false;
  if (isOwnedBySchool(candidate, schoolId)) return true;

  const unlock = await UnlockHistory.findOne({
    schoolId,
    candidateId: candidate._id,
  });
  return !!unlock;
};

export const toPreviewCandidate = (candidate) => {
  const obj = candidate.toObject ? candidate.toObject() : { ...candidate };
  SENSITIVE_FIELDS.forEach((field) => delete obj[field]);
  return {
    ...obj,
    isLocked: true,
    canEdit: false,
  };
};

export const toFullCandidate = (candidate, { canEdit = false } = {}) => {
  const obj = candidate.toObject ? candidate.toObject() : { ...candidate };
  return {
    ...obj,
    isLocked: false,
    canEdit,
  };
};

export const formatCandidateForSchool = async (candidate, schoolId) => {
  const canEdit = isOwnedBySchool(candidate, schoolId);
  const fullAccess = canEdit || (await hasFullAccess(candidate, schoolId));

  if (fullAccess) {
    return toFullCandidate(candidate, { canEdit });
  }
  return toPreviewCandidate(candidate);
};
