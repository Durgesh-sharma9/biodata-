import { Router } from 'express';
import {
  getSchools,
  getSchool,
  updateSchool,
  toggleSchoolStatus,
  getPlatformStats,
  getMySchool,
  updateMySchool,
} from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// School admin routes (accessible by school_admin)
router.get('/my-school', protect, authorize('school_admin'), getMySchool);
router.put('/my-school', protect, authorize('school_admin'), updateMySchool);

// Super admin routes
router.use(protect, authorize('super_admin'));

router.get('/stats', getPlatformStats);
router.get('/', getSchools);
router.get('/:id', getSchool);
router.put('/:id', updateSchool);
router.patch('/:id/toggle-status', toggleSchoolStatus);

export default router;
