import { Router } from 'express';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getPlans);
router.post('/', protect, authorize('super_admin'), createPlan);
router.put('/:id', protect, authorize('super_admin'), updatePlan);
router.delete('/:id', protect, authorize('super_admin'), deletePlan);

export default router;
