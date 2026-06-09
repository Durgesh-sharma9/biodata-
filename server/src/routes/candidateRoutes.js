import { Router } from 'express';
import {
  getCandidates,
  getCandidate,
  checkDuplicate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getDashboardStats,
} from '../controllers/candidateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('school_admin'));

router.get('/dashboard', getDashboardStats);
router.get('/check-duplicate', checkDuplicate);
router.get('/', getCandidates);
router.get('/:id', getCandidate);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
