import { Router } from 'express';
import { 
  getSuperAdminDashboard, 
  getAdmins, 
  getMarqueeSettings, 
  updateMarqueeSettings,
  impersonateSchool,
  getSchoolDetailsWithCandidates,
  getAllCandidatesForExport,
} from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public route for Landing Page
router.get('/marquee/public', getMarqueeSettings);

// Protected Super Admin routes
router.use(protect, authorize('super_admin'));

router.get('/dashboard', getSuperAdminDashboard);
router.get('/admins', getAdmins);
router.get('/schools/:id/details', getSchoolDetailsWithCandidates);
router.get('/candidates/export', getAllCandidatesForExport);
router.get('/marquee', getMarqueeSettings);
router.put('/marquee', updateMarqueeSettings);
router.post('/impersonate/:schoolId', impersonateSchool);

export default router;
