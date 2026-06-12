import { Router } from 'express';
import {
  getApplicantPlans,
  createApplicantPlan,
  updateApplicantPlan,
  deleteApplicantPlan,
} from '../controllers/applicantPlanController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getApplicantPlans);
router.post('/', protect, authorize('super_admin'), createApplicantPlan);
router.put('/:id', protect, authorize('super_admin'), updateApplicantPlan);
router.delete('/:id', protect, authorize('super_admin'), deleteApplicantPlan);

export default router;
