import { Router } from 'express';
import {
  getSchoolCredits,
  getUnlockHistory,
  assignCreditsToSchool,
  purchaseCreditPackage,
} from '../controllers/creditController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('school_admin'), getSchoolCredits);
router.get('/history', protect, authorize('school_admin'), getUnlockHistory);
router.post('/purchase', protect, authorize('school_admin'), purchaseCreditPackage);
router.post('/assign', protect, authorize('super_admin'), assignCreditsToSchool);

export default router;
