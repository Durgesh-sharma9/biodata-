import { Router } from 'express';
import {
  getSchools,
  getSchool,
  updateSchool,
  toggleSchoolStatus,
  getPlatformStats,
} from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('super_admin'));

router.get('/stats', getPlatformStats);
router.get('/', getSchools);
router.get('/:id', getSchool);
router.put('/:id', updateSchool);
router.patch('/:id/toggle-status', toggleSchoolStatus);

export default router;
