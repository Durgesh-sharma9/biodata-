import XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import Candidate from '../models/Candidate.js';
import Locality from '../models/Locality.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

const mapRowToCandidate = async (row) => {
  const fullName = row.fullName || row.name || row['Full Name'];
  const mobile = row.mobile || row['Mobile'] || row.phone;
  const position = row.position || row['Position'];

  if (!fullName || !mobile || !position) {
    return null;
  }

  let state = row.state || row.State || '';
  let city = row.city || row.City || '';
  let locality = row.locality || row.Locality || '';
  let localityCluster = row.localityCluster || row.cluster || row['Locality Cluster'] || '';

  if (locality && !localityCluster) {
    const loc = await Locality.findOne({ name: new RegExp(`^${locality.trim()}$`, 'i') }).populate(
      'clusterId'
    );
    if (loc) {
      localityCluster = loc.clusterId?.name || '';
      if (!city) {
        const City = (await import('../models/City.js')).default;
        const cityDoc = await City.findById(loc.cityId);
        city = cityDoc?.name || '';
      }
      if (!state) {
        const State = (await import('../models/State.js')).default;
        const stateDoc = await State.findById(loc.stateId);
        state = stateDoc?.name || '';
      }
    }
  }

  return {
    fullName: String(fullName).trim(),
    mobile: String(mobile).trim(),
    email: row.email || row.Email || '',
    address: row.address || row.Address || '',
    position: String(position).trim(),
    qualifications: row.qualifications
      ? String(row.qualifications)
          .split(',')
          .map((q) => q.trim())
          .filter(Boolean)
      : [],
    experienceYears: Number(row.experienceYears || row.experience || 0) || 0,
    expectedSalary: row.expectedSalary ? Number(row.expectedSalary) : undefined,
    state,
    city,
    locality,
    localityCluster,
    source: 'SUPER_ADMIN_IMPORT',
    ownerSchoolId: null,
    schoolId: null,
  };
};

export const importSingleCandidate = catchAsync(async (req, res) => {
  const { localityId, ...body } = req.body;

  if (!body.fullName || !body.mobile || !body.position) {
    throw new ApiError(400, 'Full name, mobile, and position are required');
  }

  if (localityId) {
    const { resolveLocationFromLocalityId } = await import('../utils/locationHelper.js');
    const loc = await resolveLocationFromLocalityId(localityId);
    body.state = loc.state;
    body.city = loc.city;
    body.locality = loc.locality;
    body.localityCluster = loc.localityCluster;
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

  const results = { imported: 0, skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    try {
      const data = await mapRowToCandidate(rows[i]);
      if (!data) {
        results.skipped++;
        results.errors.push({ row: i + 1, message: 'Missing required fields' });
        continue;
      }
      await Candidate.create(data);
      results.imported++;
    } catch (err) {
      results.skipped++;
      results.errors.push({ row: i + 1, message: err.message });
    }
  }

  res.json({ success: true, data: results });
});
