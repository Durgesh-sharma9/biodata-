import { Router } from 'express';
import {
  sendInterestRequest,
  getSentInterestRequests,
  getInterestRequestStatus,
} from '../controllers/interestRequestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('school_admin'));

router.post('/', sendInterestRequest);
router.get('/sent', getSentInterestRequests);
router.get('/status/:candidateId', getInterestRequestStatus);

export default router;
