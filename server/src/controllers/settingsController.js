import SchoolSettings from '../models/SchoolSettings.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  DEFAULT_POSITIONS,
  DEFAULT_SUBJECTS,
  DEFAULT_CLASSES,
  DEFAULT_QUALIFICATIONS,
} from '../config/constants.js';

const ALLOWED_FIELDS = ['positions', 'subjects', 'qualifications', 'classes'];

const DEFAULTS_MAP = {
  positions: DEFAULT_POSITIONS,
  subjects: DEFAULT_SUBJECTS,
  qualifications: DEFAULT_QUALIFICATIONS,
  classes: DEFAULT_CLASSES,
};

export const getSettings = catchAsync(async (req, res) => {
  let settings = await SchoolSettings.findOne({ schoolId: req.schoolId });

  if (!settings) {
    settings = await SchoolSettings.create({ schoolId: req.schoolId });
  }

  res.json({ success: true, data: settings });
});

export const addSettingItem = catchAsync(async (req, res) => {
  const { field, value } = req.body;

  if (!ALLOWED_FIELDS.includes(field)) {
    throw new ApiError(400, 'Invalid settings field');
  }

  if (!value?.trim()) {
    throw new ApiError(400, 'Value is required');
  }

  let settings = await SchoolSettings.findOne({ schoolId: req.schoolId });
  if (!settings) {
    settings = await SchoolSettings.create({ schoolId: req.schoolId });
  }

  const trimmed = value.trim();
  if (settings[field].includes(trimmed)) {
    throw new ApiError(400, 'Item already exists');
  }

  settings[field].push(trimmed);
  await settings.save();

  res.json({ success: true, data: settings });
});

export const bulkAddSettingItems = catchAsync(async (req, res) => {
  const { field, values } = req.body;

  if (!ALLOWED_FIELDS.includes(field)) {
    throw new ApiError(400, 'Invalid settings field');
  }

  if (!Array.isArray(values) || values.length === 0) {
    throw new ApiError(400, 'Values array is required');
  }

  let settings = await SchoolSettings.findOne({ schoolId: req.schoolId });
  if (!settings) {
    settings = await SchoolSettings.create({ schoolId: req.schoolId });
  }

  const currentSet = new Set(settings[field]);
  values.forEach((v) => {
    const trimmed = String(v).trim();
    if (trimmed && !currentSet.has(trimmed)) {
      settings[field].push(trimmed);
      currentSet.add(trimmed);
    }
  });

  await settings.save();
  res.json({ success: true, data: settings });
});

export const removeSettingItem = catchAsync(async (req, res) => {
  const { field, value } = req.body;

  if (!ALLOWED_FIELDS.includes(field)) {
    throw new ApiError(400, 'Invalid settings field');
  }

  const settings = await SchoolSettings.findOne({ schoolId: req.schoolId });
  if (!settings) throw new ApiError(404, 'Settings not found');

  settings[field] = settings[field].filter((item) => item !== value);
  await settings.save();

  res.json({ success: true, data: settings });
});

export const resetField = catchAsync(async (req, res) => {
  const { field } = req.body;

  if (!ALLOWED_FIELDS.includes(field)) {
    throw new ApiError(400, 'Invalid settings field to reset');
  }

  let settings = await SchoolSettings.findOne({ schoolId: req.schoolId });
  if (!settings) {
    settings = await SchoolSettings.create({ schoolId: req.schoolId });
  }

  settings[field] = [...(DEFAULTS_MAP[field] || [])];
  await settings.save();

  res.json({ success: true, message: `${field} reset to defaults`, data: settings });
});

export const setFieldItems = catchAsync(async (req, res) => {
  const { field, values } = req.body;

  if (!ALLOWED_FIELDS.includes(field)) {
    throw new ApiError(400, 'Invalid settings field');
  }

  if (!Array.isArray(values)) {
    throw new ApiError(400, 'Values array is required');
  }

  let settings = await SchoolSettings.findOne({ schoolId: req.schoolId });
  if (!settings) {
    settings = await SchoolSettings.create({ schoolId: req.schoolId });
  }

  settings[field] = values.map((v) => String(v).trim()).filter(Boolean);
  await settings.save();

  res.json({ success: true, message: `${field} updated successfully`, data: settings });
});

export const updatePreferences = catchAsync(async (req, res) => {
  const {
    isActivelyHiring,
    allowWalkInApplications,
    emailNotifications,
    whatsappAlerts,
    dailyDigest,
    smsAlerts,
    weeklyReport,
    autoAcknowledgeCandidates,
    customWelcomeMessage,
    contactWorkingHours,
    preferredExperienceMin,
    boardAffiliation,
    hrContactPerson,
    hrContactDesignation,
    hrContactPhone,
    interviewMode,
    salaryVisibility,
    staffBenefits,
    interviewReminderHours,
  } = req.body;

  let settings = await SchoolSettings.findOne({ schoolId: req.schoolId });
  if (!settings) {
    settings = await SchoolSettings.create({ schoolId: req.schoolId });
  }

  if (typeof isActivelyHiring === 'boolean') settings.isActivelyHiring = isActivelyHiring;
  if (typeof allowWalkInApplications === 'boolean') settings.allowWalkInApplications = allowWalkInApplications;
  if (typeof emailNotifications === 'boolean') settings.emailNotifications = emailNotifications;
  if (typeof whatsappAlerts === 'boolean') settings.whatsappAlerts = whatsappAlerts;
  if (typeof dailyDigest === 'boolean') settings.dailyDigest = dailyDigest;
  if (typeof smsAlerts === 'boolean') settings.smsAlerts = smsAlerts;
  if (typeof weeklyReport === 'boolean') settings.weeklyReport = weeklyReport;
  if (typeof autoAcknowledgeCandidates === 'boolean') settings.autoAcknowledgeCandidates = autoAcknowledgeCandidates;
  if (customWelcomeMessage !== undefined) settings.customWelcomeMessage = customWelcomeMessage;
  if (contactWorkingHours !== undefined) settings.contactWorkingHours = contactWorkingHours;
  if (preferredExperienceMin !== undefined) settings.preferredExperienceMin = Number(preferredExperienceMin) || 0;
  if (boardAffiliation !== undefined) settings.boardAffiliation = boardAffiliation;
  if (hrContactPerson !== undefined) settings.hrContactPerson = hrContactPerson;
  if (hrContactDesignation !== undefined) settings.hrContactDesignation = hrContactDesignation;
  if (hrContactPhone !== undefined) settings.hrContactPhone = hrContactPhone;
  if (interviewMode !== undefined) settings.interviewMode = interviewMode;
  if (salaryVisibility !== undefined) settings.salaryVisibility = salaryVisibility;
  if (Array.isArray(staffBenefits)) settings.staffBenefits = staffBenefits;
  if (interviewReminderHours !== undefined) settings.interviewReminderHours = Number(interviewReminderHours) || 24;

  await settings.save();
  res.json({ success: true, message: 'Preferences updated successfully', data: settings });
});

