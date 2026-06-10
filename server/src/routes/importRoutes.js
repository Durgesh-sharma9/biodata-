import { Router } from 'express';
import { importSingleCandidate, importBulkCandidates } from '../controllers/importController.js';
import { protect, authorize } from '../middleware/auth.js';
import { importUpload } from '../middleware/upload.js';

const router = Router();

router.use(protect, authorize('super_admin'));

router.post('/single', importSingleCandidate);
router.post('/bulk', importUpload.single('file'), importBulkCandidates);

export default router;
