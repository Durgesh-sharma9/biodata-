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

// Public read access for positions and master data (needed for school forms, public apply & candidate forms)
router.get('/all', getAllMasterData);
router.get('/positions', getAllPositions);
router.get('/subjects', getAllSubjects);
router.get('/qualifications', getAllQualifications);
router.get('/classes', getAllClasses);

// All mutation routes require authentication & super_admin authorization
router.use(protect, authorize('super_admin'));

// Position routes
router.post('/positions', createPosition);
router.route('/positions/:id').put(updatePosition).delete(deletePosition);

// Subject routes
router.post('/subjects', createSubject);
router.route('/subjects/:id').put(updateSubject).delete(deleteSubject);

// Qualification routes
router.post('/qualifications', createQualification);
router.route('/qualifications/:id').put(updateQualification).delete(deleteQualification);

// Class routes
router.post('/classes', createClass);
router.route('/classes/:id').put(updateClass).delete(deleteClass);

export default router;
