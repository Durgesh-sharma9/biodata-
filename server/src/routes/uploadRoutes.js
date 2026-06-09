import { Router } from 'express';
import { uploadFiles, getUploadAuth } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/auth', getUploadAuth);
router.post('/', upload.array('files', 10), uploadFiles);

export default router;
