import { getImageKit } from '../config/imagekit.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { MAX_DOCUMENTS, MAX_FILE_SIZE } from '../config/constants.js';

export const uploadFiles = catchAsync(async (req, res) => {
  const ik = getImageKit();

  if (!ik) {
    throw new ApiError(500, 'ImageKit is not configured. Set IMAGEKIT_* env variables.');
  }

  if (!req.files?.length) {
    throw new ApiError(400, 'No files uploaded');
  }

  if (req.files.length > MAX_DOCUMENTS) {
    throw new ApiError(400, `Maximum ${MAX_DOCUMENTS} files allowed`);
  }

  const uploads = await Promise.all(
    req.files.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new ApiError(400, `File ${file.originalname} exceeds 10MB limit`);
      }

      const result = await ik.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: `/bio-mgmt/${req.schoolId || 'platform'}`,
      });

      return {
        name: file.originalname,
        url: result.url,
        type: file.fieldname || 'other',
      };
    })
  );

  res.json({ success: true, data: uploads });
});

export const getUploadAuth = catchAsync(async (req, res) => {
  const ik = getImageKit();

  if (!ik) {
    throw new ApiError(500, 'ImageKit is not configured');
  }

  const result = ik.getAuthenticationParameters();
  res.json({ success: true, data: result });
});
