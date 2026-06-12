import { Router } from 'express';
import { uploadFiles, getUploadAuth, uploadPublicFiles } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/public', upload.array('files', 10), uploadPublicFiles);

router.use(protect);

router.get('/auth', getUploadAuth);
router.post('/', upload.array('files', 10), uploadFiles);

export default router;
