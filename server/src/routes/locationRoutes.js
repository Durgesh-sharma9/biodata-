import { Router } from 'express';
import {
  getStates,
  createState,
  updateState,
  deleteState,
  getCities,
  createCity,
  updateCity,
  deleteCity,
  importIndiaLocations,
} from '../controllers/locationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/states', getStates);
router.get('/cities', getCities);

router.post('/states', protect, authorize('super_admin'), createState);
router.put('/states/:id', protect, authorize('super_admin'), updateState);
router.delete('/states/:id', protect, authorize('super_admin'), deleteState);

router.post('/cities', protect, authorize('super_admin'), createCity);
router.put('/cities/:id', protect, authorize('super_admin'), updateCity);
router.delete('/cities/:id', protect, authorize('super_admin'), deleteCity);

// Locality routes removed — area is now free-text

router.post('/import-india', protect, authorize('super_admin'), importIndiaLocations);

export default router;
