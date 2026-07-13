import Position from '../models/Position.js';
import Subject from '../models/Subject.js';
import Qualification from '../models/Qualification.js';
import Class from '../models/Class.js';
import { ApiError } from '../utils/ApiError.js';

// Position CRUD
export const getAllPositions = async (req, res, next) => {
  try {
    const positions = await Position.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: positions });
  } catch (error) {
    next(error);
  }
};

export const createPosition = async (req, res, next) => {
  try {
    const { name } = req.body;
    const position = await Position.create({ name });
    res.status(201).json({ success: true, data: position });
  } catch (error) {
    next(error);
  }
};

export const updatePosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const position = await Position.findByIdAndUpdate(id, { name, isActive }, { new: true, runValidators: true });
    if (!position) throw new ApiError('Position not found', 404);
    res.json({ success: true, data: position });
  } catch (error) {
    next(error);
  }
};

export const deletePosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const position = await Position.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!position) throw new ApiError('Position not found', 404);
    res.json({ success: true, data: position });
  } catch (error) {
    next(error);
  }
};

// Subject CRUD
export const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const { name } = req.body;
    const subject = await Subject.create({ name });
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const subject = await Subject.findByIdAndUpdate(id, { name, isActive }, { new: true, runValidators: true });
    if (!subject) throw new ApiError('Subject not found', 404);
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!subject) throw new ApiError('Subject not found', 404);
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

// Qualification CRUD
export const getAllQualifications = async (req, res, next) => {
  try {
    const qualifications = await Qualification.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: qualifications });
  } catch (error) {
    next(error);
  }
};

export const createQualification = async (req, res, next) => {
  try {
    const { name } = req.body;
    const qualification = await Qualification.create({ name });
    res.status(201).json({ success: true, data: qualification });
  } catch (error) {
    next(error);
  }
};

export const updateQualification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const qualification = await Qualification.findByIdAndUpdate(id, { name, isActive }, { new: true, runValidators: true });
    if (!qualification) throw new ApiError('Qualification not found', 404);
    res.json({ success: true, data: qualification });
  } catch (error) {
    next(error);
  }
};

export const deleteQualification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const qualification = await Qualification.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!qualification) throw new ApiError('Qualification not found', 404);
    res.json({ success: true, data: qualification });
  } catch (error) {
    next(error);
  }
};

// Class CRUD
export const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: classes });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cls = await Class.create({ name });
    res.status(201).json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const cls = await Class.findByIdAndUpdate(id, { name, isActive }, { new: true, runValidators: true });
    if (!cls) throw new ApiError('Class not found', 404);
    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cls = await Class.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!cls) throw new ApiError('Class not found', 404);
    res.json({ success: true, data: cls });
  } catch (error) {
    next(error);
  }
};

// Get all master data in one call (for dropdowns)
export const getAllMasterData = async (req, res, next) => {
  try {
    const [positions, subjects, qualifications, classes] = await Promise.all([
      Position.find({ isActive: true }).sort({ name: 1 }),
      Subject.find({ isActive: true }).sort({ name: 1 }),
      Qualification.find({ isActive: true }).sort({ name: 1 }),
      Class.find({ isActive: true }).sort({ name: 1 }),
    ]);

    res.json({
      success: true,
      data: {
        positions: positions.map((p) => p.name),
        subjects: subjects.map((s) => s.name),
        qualifications: qualifications.map((q) => q.name),
        classes: classes.map((c) => c.name),
      },
    });
  } catch (error) {
    next(error);
  }
};
