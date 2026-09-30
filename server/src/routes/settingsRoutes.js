import { Router } from 'express';
import {
  getSettings,
  addSettingItem,
  bulkAddSettingItems,
  removeSettingItem,
  resetField,
  setFieldItems,
  updatePreferences,
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('school_admin'));

router.get('/', getSettings);
router.post('/add', addSettingItem);
router.post('/bulk-add', bulkAddSettingItems);
router.post('/remove', removeSettingItem);
router.post('/reset', resetField);
router.put('/field', setFieldItems);
router.put('/preferences', updatePreferences);

export default router;

