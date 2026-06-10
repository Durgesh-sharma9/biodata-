import { Router } from 'express';
import {
  getApplicationLink,
  getApplicationQR,
  getSchoolBySlug,
  submitApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/link', protect, authorize('school_admin'), getApplicationLink);
router.get('/qr', protect, authorize('school_admin'), getApplicationQR);
router.get('/school/:slug', getSchoolBySlug);
router.post('/submit/:slug', submitApplication);

export default router;
