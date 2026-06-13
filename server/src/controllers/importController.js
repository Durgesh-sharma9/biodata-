import XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import Candidate from '../models/Candidate.js';
import Locality from '../models/Locality.js';
import Position from '../models/Position.js';
import Subject from '../models/Subject.js';
import Qualification from '../models/Qualification.js';
import Class from '../models/Class.js';
import State from '../models/State.js';
import City from '../models/City.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

const mapRowToCandidate = async (row, masterData) => {
  const fullName = row.fullName || row.name || row['Full Name'] || row['Name'];
  const mobile = row.mobile || row['Mobile'] || row.phone || row['Phone'];
  const position = row.position || row['Position'] || masterData.position;

  if (!fullName || !mobile || !position) {
    return null;
  }

  // Validate position exists in master data
  const positionExists = await Position.findOne({ name: position, isActive: true });
  if (!positionExists) {
    throw new Error(`Position "${position}" not found in master data`);
  }

  let state = row.state || row.State || '';
  let city = row.city || row.City || '';
  let locality = row.locality || row.Locality || '';

  // Validate state if provided
  if (state) {
    const stateExists = await State.findOne({ name: new RegExp(`^${state.trim()}$`, 'i') });
    if (!stateExists) {
      throw new Error(`State "${state}" not found in master data`);
    }
  }

  // Validate city if provided
  if (city) {
    const cityExists = await City.findOne({ name: new RegExp(`^${city.trim()}$`, 'i') });
    if (!cityExists) {
      throw new Error(`City "${city}" not found in master data`);
    }
  }

  // Validate locality if provided
  if (locality) {
    const localityExists = await Locality.findOne({ name: new RegExp(`^${locality.trim()}$`, 'i') });
    if (!localityExists) {
      throw new Error(`Locality "${locality}" not found in master data`);
    }
  }

  // Validate subjects if provided
  let qualifications = [];
  if (row.qualifications || row.Qualification || row['Qualification']) {
    const qualString = row.qualifications || row.Qualification || row['Qualification'];
    qualifications = String(qualString)
      .split(',')
      .map((q) => q.trim())
      .filter(Boolean);

    for (const qual of qualifications) {
      const qualExists = await Qualification.findOne({ name: new RegExp(`^${qual}$`, 'i'), isActive: true });
      if (!qualExists) {
        throw new Error(`Qualification "${qual}" not found in master data`);
      }
    }
  }

  // Validate subjects if provided
  let subjects = [];
  if (row.subjects || row.Subjects || row['Subjects']) {
    const subjectString = row.subjects || row.Subjects || row['Subjects'];
    subjects = String(subjectString)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const subject of subjects) {
      const subjectExists = await Subject.findOne({ name: new RegExp(`^${subject}$`, 'i'), isActive: true });
      if (!subjectExists) {
        throw new Error(`Subject "${subject}" not found in master data`);
      }
    }
  }

  // Validate classes if provided
  let classesCanTeach = [];
  if (row.classes || row.Classes || row['Classes'] || row.classesCanTeach || row['Classes Can Teach']) {
    const classString = row.classes || row.Classes || row['Classes'] || row.classesCanTeach || row['Classes Can Teach'];
    classesCanTeach = String(classString)
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    for (const cls of classesCanTeach) {
      const classExists = await Class.findOne({ name: new RegExp(`^${cls}$`, 'i'), isActive: true });
      if (!classExists) {
        throw new Error(`Class "${cls}" not found in master data`);
      }
    }
  }

  if (locality && !city) {
    const loc = await Locality.findOne({ name: new RegExp(`^${locality.trim()}$`, 'i') });
    if (loc) {
      const cityDoc = await City.findById(loc.cityId);
      const stateDoc = await State.findById(loc.stateId);
      city = cityDoc?.name || '';
      state = stateDoc?.name || '';
    }
  }

  const candidateData = {
    fullName: String(fullName).trim(),
    mobile: String(mobile).trim(),
    email: row.email || row.Email || '',
    address: row.address || row.Address || '',
    position: String(position).trim(),
    qualifications,
    subjects,
    classesCanTeach,
    experienceYears: Number(row.experienceYears || row.experience || row['Experience'] || 0) || 0,
    expectedSalary: row.expectedSalary || row['ExpectedSalary'] ? Number(row.expectedSalary || row['ExpectedSalary']) : undefined,
    state,
    city,
    locality,
    source: 'SUPER_ADMIN_IMPORT',
    ownerSchoolId: null,
    schoolId: null,
  };

  // Add position-specific fields based on position
  if (position === 'Teacher') {
    candidateData.medium = row.medium || row['Medium'] || '';
    candidateData.boardExperience = row.boardExperience || row['Board Experience'] 
      ? String(row.boardExperience || row['Board Experience']).split(',').map(b => b.trim())
      : [];
    candidateData.bEd = row.bEd || row['B.Ed'] === true || row.bEd === 'true' || row['B.Ed'] === 'true';
    candidateData.mEd = row.mEd || row['M.Ed'] === true || row.mEd === 'true' || row['M.Ed'] === 'true';
  }

  if (position === 'Driver') {
    candidateData.vehicleTypes = row.vehicleTypes || row['Vehicle Types']
      ? String(row.vehicleTypes || row['Vehicle Types']).split(',').map(v => v.trim())
      : [];
    candidateData.lightVehicle = row.lightVehicle || row['Light Vehicle'] === true || row.lightVehicle === 'true';
    candidateData.heavyVehicle = row.heavyVehicle || row['Heavy Vehicle'] === true || row.heavyVehicle === 'true';
    candidateData.schoolBusExperience = row.schoolBusExperience || row['School Bus Experience'] === true;
    candidateData.drivingExperience = Number(row.drivingExperience || row['Driving Experience'] || 0);
  }

  if (position === 'Accountant') {
    candidateData.tallyKnowledge = row.tallyKnowledge || row['Tally Knowledge'] === true;
    candidateData.gstKnowledge = row.gstKnowledge || row['GST Knowledge'] === true;
    candidateData.payrollExperience = row.payrollExperience || row['Payroll Experience'] === true;
    candidateData.schoolAccountingExperience = row.schoolAccountingExperience || row['School Accounting Experience'] === true;
    candidateData.erpExperience = row.erpExperience || row['ERP Experience'] === true;
  }

  if (position === 'Receptionist') {
    candidateData.languagesKnown = row.languagesKnown || row['Languages Known']
      ? String(row.languagesKnown || row['Languages Known']).split(',').map(l => l.trim())
      : [];
    candidateData.computerSkills = row.computerSkills || row['Computer Skills'] === true;
    candidateData.frontDeskExperience = row.frontDeskExperience || row['Front Desk Experience'] === true;
    candidateData.communicationSkills = row.communicationSkills || row['Communication Skills'] === true;
  }

  if (position === 'Clerk') {
    candidateData.typingSpeed = row.typingSpeed || row['Typing Speed'] || '';
    candidateData.msOfficeKnowledge = row.msOfficeKnowledge || row['MS Office Knowledge'] === true;
    candidateData.excelKnowledge = row.excelKnowledge || row['Excel Knowledge'] === true;
    candidateData.schoolOfficeExperience = row.schoolOfficeExperience || row['School Office Experience'] === true;
  }

  if (position === 'Librarian') {
    candidateData.libraryManagementExperience = row.libraryManagementExperience || row['Library Management Experience'] === true;
    candidateData.librarySoftwareKnowledge = row.librarySoftwareKnowledge || row['Library Software Knowledge'] === true;
  }

  if (position === 'Lab Assistant') {
    candidateData.labType = row.labType || row['Lab Type'] || '';
    candidateData.labExperience = row.labExperience || row['Lab Experience'] === true;
  }

  if (position === 'Sports Coach') {
    candidateData.sportsSpecialization = row.sportsSpecialization || row['Sports Specialization'] || '';
    candidateData.coachingCertificates = row.coachingCertificates || row['Coaching Certificates']
      ? String(row.coachingCertificates || row['Coaching Certificates']).split(',').map(c => c.trim())
      : [];
    candidateData.coachingExperience = row.coachingExperience || row['Coaching Experience'] === true;
  }

  if (position === 'Security Guard') {
    candidateData.securityExperience = row.securityExperience || row['Security Experience'] === true;
    candidateData.exArmy = row.exArmy || row['Ex Army'] === true;
    candidateData.nightShiftAvailable = row.nightShiftAvailable || row['Night Shift Available'] === true;
  }

  if (position === 'Cleaner') {
    candidateData.cleaningExperience = row.cleaningExperience || row['Cleaning Experience'] === true;
    candidateData.schoolExperience = row.schoolExperience || row['School Experience'] === true;
  }

  return candidateData;
};

export const importSingleCandidate = catchAsync(async (req, res) => {
  const { localityId, ...body } = req.body;

  if (!body.fullName || !body.mobile || !body.position) {
    throw new ApiError(400, 'Full name, mobile, and position are required');
  }

  // Validate position exists
  const positionExists = await Position.findOne({ name: body.position, isActive: true });
  if (!positionExists) {
    throw new ApiError(400, `Position "${body.position}" not found in master data`);
  }

  if (localityId) {
    const { resolveLocationFromLocalityId } = await import('../utils/locationHelper.js');
    const loc = await resolveLocationFromLocalityId(localityId);
    body.state = loc.state;
    body.city = loc.city;
    body.locality = loc.locality;
  }

  const candidate = await Candidate.create({
    ...body,
    mobile: body.mobile.trim(),
    source: 'SUPER_ADMIN_IMPORT',
    ownerSchoolId: null,
    schoolId: null,
  });

  res.status(201).json({ success: true, data: candidate });
});

export const importBulkCandidates = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'File is required');

  const position = req.body.position;
  if (!position) {
    throw new ApiError(400, 'Position is required for bulk import');
  }

  const filename = req.file.originalname.toLowerCase();
  let rows = [];

  if (filename.endsWith('.csv')) {
    const content = req.file.buffer.toString('utf-8');
    rows = parse(content, { columns: true, skip_empty_lines: true, trim: true });
  } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet);
  } else {
    throw new ApiError(400, 'Only CSV and Excel files are supported');
  }

  const results = { totalRows: rows.length, validRows: 0, invalidRows: 0, imported: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    try {
      const data = await mapRowToCandidate(rows[i], { position });
      if (!data) {
        results.invalidRows++;
        results.errors.push({ row: i + 2, message: 'Missing required fields (Name, Mobile, Position)' });
        continue;
      }
      await Candidate.create(data);
      results.validRows++;
      results.imported++;
    } catch (err) {
      results.invalidRows++;
      results.errors.push({ row: i + 2, message: err.message });
    }
  }

  res.json({ success: true, data: results });
});
