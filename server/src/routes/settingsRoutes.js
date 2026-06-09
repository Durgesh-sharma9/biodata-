import { Router } from 'express';
import { getSettings, addSettingItem, removeSettingItem } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('school_admin'));

router.get('/', getSettings);
router.post('/add', addSettingItem);
router.post('/remove', removeSettingItem);

export default router;
