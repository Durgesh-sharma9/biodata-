import { Router } from 'express';
import { getSuperAdminDashboard, getAdmins } from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('super_admin'));

router.get('/dashboard', getSuperAdminDashboard);
router.get('/admins', getAdmins);

export default router;
