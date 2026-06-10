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
  getClusters,
  createCluster,
  updateCluster,
  deleteCluster,
  getLocalities,
  createLocality,
  updateLocality,
  deleteLocality,
} from '../controllers/locationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public read for dropdowns
router.get('/states', getStates);
router.get('/cities', getCities);
router.get('/clusters', getClusters);
router.get('/localities', getLocalities);

// Super admin write
router.post('/states', protect, authorize('super_admin'), createState);
router.put('/states/:id', protect, authorize('super_admin'), updateState);
router.delete('/states/:id', protect, authorize('super_admin'), deleteState);

router.post('/cities', protect, authorize('super_admin'), createCity);
router.put('/cities/:id', protect, authorize('super_admin'), updateCity);
router.delete('/cities/:id', protect, authorize('super_admin'), deleteCity);

router.post('/clusters', protect, authorize('super_admin'), createCluster);
router.put('/clusters/:id', protect, authorize('super_admin'), updateCluster);
router.delete('/clusters/:id', protect, authorize('super_admin'), deleteCluster);

router.post('/localities', protect, authorize('super_admin'), createLocality);
router.put('/localities/:id', protect, authorize('super_admin'), updateLocality);
router.delete('/localities/:id', protect, authorize('super_admin'), deleteLocality);

export default router;
