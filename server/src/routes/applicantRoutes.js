import { Router } from 'express';
import {
  registerApplicant,
  getApplicantProfile,
  updateApplicantProfile,
  submitPublicApplication,
} from '../controllers/applicantController.js';
import {
  getApplicantSubscription,
  getApplicantSubscriptionHistory,
  purchaseApplicantPlan,
  getReceivedRequests,
  getRequestSchoolDetails,
  getApplicantDashboard,
} from '../controllers/applicantSubscriptionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/apply', submitPublicApplication);
router.post('/register', registerApplicant);

router.get('/dashboard', protect, authorize('self_applicant'), getApplicantDashboard);
router.get('/profile', protect, authorize('self_applicant'), getApplicantProfile);
router.put('/profile', protect, authorize('self_applicant'), updateApplicantProfile);
router.get('/requests', protect, authorize('self_applicant'), getReceivedRequests);
router.get('/requests/:requestId/school', protect, authorize('self_applicant'), getRequestSchoolDetails);
router.get('/subscription', protect, authorize('self_applicant'), getApplicantSubscription);
router.get('/subscription/history', protect, authorize('self_applicant'), getApplicantSubscriptionHistory);
router.post('/subscription/purchase', protect, authorize('self_applicant'), purchaseApplicantPlan);

export default router;
