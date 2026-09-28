import Position from '../models/Position.js';
import Subject from '../models/Subject.js';
import Qualification from '../models/Qualification.js';
import Class from '../models/Class.js';
import MasterDataRequest from '../models/MasterDataRequest.js';
import School from '../models/School.js';
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
    const { name, fields } = req.body;
    const position = await Position.create({ name: name.trim(), fields: fields || [] });
    res.status(201).json({ success: true, data: position });
  } catch (error) {
    next(error);
  }
};

export const updatePosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isActive, fields } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (fields !== undefined) updateData.fields = fields;

    const position = await Position.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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
        positionsList: positions,
        subjects: subjects.map((s) => s.name),
        qualifications: qualifications.map((q) => q.name),
        classes: classes.map((c) => c.name),
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- Master Data Requests (School <-> Super Admin Workflow) ---

// School Admin creates a request
export const createMasterDataRequest = async (req, res, next) => {
  try {
    const { category, name, description } = req.body;

    if (!category || !name?.trim()) {
      throw new ApiError('Category and name are required', 400);
    }

    const school = await School.findById(req.user.schoolId || req.schoolId);
    if (!school) {
      throw new ApiError('School not found', 404);
    }

    const request = await MasterDataRequest.create({
      schoolId: school._id,
      schoolName: school.schoolName,
      requestedBy: req.user._id,
      category: category.toLowerCase().trim(),
      name: name.trim(),
      description: description?.trim() || '',
      status: 'pending',
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// School Admin views their own requests
export const getMyMasterDataRequests = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId || req.schoolId;
    const requests = await MasterDataRequest.find({ schoolId }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

// Super Admin views all requests
export const getAllMasterDataRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await MasterDataRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

// Super Admin approves or rejects a request
export const updateMasterDataRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new ApiError('Invalid status value', 400);
    }

    const request = await MasterDataRequest.findById(id);
    if (!request) {
      throw new ApiError('Request not found', 404);
    }

    request.status = status;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;
    await request.save();

    // If approved, automatically create the item if it doesn't already exist
    if (status === 'approved') {
      const trimmedName = request.name.trim();
      if (request.category === 'subject') {
        const existing = await Subject.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if (!existing) await Subject.create({ name: trimmedName });
      } else if (request.category === 'qualification') {
        const existing = await Qualification.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if (!existing) await Qualification.create({ name: trimmedName });
      } else if (request.category === 'class') {
        const existing = await Class.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if (!existing) await Class.create({ name: trimmedName });
      } else if (request.category === 'position') {
        const existing = await Position.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if (!existing) await Position.create({ name: trimmedName, fields: [] });
      }
    }

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

