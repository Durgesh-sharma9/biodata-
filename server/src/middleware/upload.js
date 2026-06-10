import multer from 'multer';
import { MAX_FILE_SIZE, MAX_DOCUMENTS } from '../config/constants.js';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type not allowed: ${file.originalname}`), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_DOCUMENTS },
  fileFilter,
});

const importFileFilter = (req, file, cb) => {
  const allowed = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  const name = file.originalname.toLowerCase();
  if (allowed.includes(file.mimetype) || name.endsWith('.csv') || name.endsWith('.xlsx') || name.endsWith('.xls')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type not allowed: ${file.originalname}`), false);
  }
};

export const importUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE * 2, files: 1 },
  fileFilter: importFileFilter,
});
