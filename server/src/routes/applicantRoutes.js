import { Router } from 'express';
import {
  registerApplicant,
  getApplicantProfile,
  updateApplicantProfile,
} from '../controllers/applicantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerApplicant);
router.get('/profile', protect, authorize('self_applicant'), getApplicantProfile);
router.put('/profile', protect, authorize('self_applicant'), updateApplicantProfile);

export default router;
