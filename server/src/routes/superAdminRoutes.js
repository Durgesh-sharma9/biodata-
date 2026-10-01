import { Router } from 'express';
import { 
  getSuperAdminDashboard, 
  getAdmins, 
  getMarqueeSettings, 
  updateMarqueeSettings 
} from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public route for Landing Page
router.get('/marquee/public', getMarqueeSettings);

// Protected Super Admin routes
router.use(protect, authorize('super_admin'));

router.get('/dashboard', getSuperAdminDashboard);
router.get('/admins', getAdmins);
router.get('/marquee', getMarqueeSettings);
router.put('/marquee', updateMarqueeSettings);

export default router;
