import { Router } from 'express';
import {
  registerApplicant,
  getApplicantProfile,
  updateApplicantProfile,
  submitPublicApplication,
  signupApplicant,
  loginApplicant,
} from '../controllers/applicantController.js';
import {
  getApplicantSubscription,
  getApplicantSubscriptionHistory,
  purchaseApplicantPlan,
  getReceivedRequests,
  getRequestSchoolDetails,
  getApplicantDashboard,
  unlockRequest,
} from '../controllers/applicantSubscriptionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/apply', submitPublicApplication);
router.post('/register', registerApplicant);
router.post('/signup', signupApplicant);
router.post('/login', loginApplicant);

router.get('/dashboard', protect, authorize('self_applicant', 'applicant'), getApplicantDashboard);
router.get('/profile', protect, authorize('self_applicant', 'applicant'), getApplicantProfile);
router.put('/profile', protect, authorize('self_applicant', 'applicant'), updateApplicantProfile);
router.get('/requests', protect, authorize('self_applicant', 'applicant'), getReceivedRequests);
router.get('/requests/:requestId/school', protect, authorize('self_applicant', 'applicant'), getRequestSchoolDetails);
router.post('/requests/:requestId/unlock', protect, authorize('self_applicant', 'applicant'), unlockRequest);
router.get('/subscription', protect, authorize('self_applicant', 'applicant'), getApplicantSubscription);
router.get('/subscription/history', protect, authorize('self_applicant', 'applicant'), getApplicantSubscriptionHistory);
router.post('/subscription/purchase', protect, authorize('self_applicant', 'applicant'), purchaseApplicantPlan);

export default router;
