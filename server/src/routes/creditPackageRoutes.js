import { Router } from 'express';
import {
  getCreditPackages,
  createCreditPackage,
  updateCreditPackage,
  deleteCreditPackage,
} from '../controllers/creditPackageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getCreditPackages);
router.post('/', protect, authorize('super_admin'), createCreditPackage);
router.put('/:id', protect, authorize('super_admin'), updateCreditPackage);
router.delete('/:id', protect, authorize('super_admin'), deleteCreditPackage);

export default router;
