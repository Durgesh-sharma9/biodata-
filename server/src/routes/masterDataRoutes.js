import express from 'express';
import {
  getAllPositions,
  createPosition,
  updatePosition,
  deletePosition,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getAllQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getAllMasterData,
} from '../controllers/masterDataController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All master data routes require authentication
router.use(protect);

// Get all master data in one call (read access for all authenticated users)
router.get('/all', getAllMasterData);

// Position routes
router.route('/positions').get(getAllPositions).post(authorize('super_admin'), createPosition);
router.route('/positions/:id').put(authorize('super_admin'), updatePosition).delete(authorize('super_admin'), deletePosition);

// Subject routes
router.route('/subjects').get(getAllSubjects).post(authorize('super_admin'), createSubject);
router.route('/subjects/:id').put(authorize('super_admin'), updateSubject).delete(authorize('super_admin'), deleteSubject);

// Qualification routes
router.route('/qualifications').get(getAllQualifications).post(authorize('super_admin'), createQualification);
router.route('/qualifications/:id').put(authorize('super_admin'), updateQualification).delete(authorize('super_admin'), deleteQualification);

// Class routes
router.route('/classes').get(getAllClasses).post(authorize('super_admin'), createClass);
router.route('/classes/:id').put(authorize('super_admin'), updateClass).delete(authorize('super_admin'), deleteClass);

export default router;
