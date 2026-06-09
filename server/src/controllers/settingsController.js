import SchoolSettings from '../models/SchoolSettings.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

const ALLOWED_FIELDS = ['positions', 'subjects', 'qualifications', 'classes'];

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
