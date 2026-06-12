import State from '../models/State.js';
import City from '../models/City.js';
import Locality from '../models/Locality.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getStates = catchAsync(async (req, res) => {
  const states = await State.find().sort({ name: 1 });
  res.json({ success: true, data: states });
});

export const createState = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new ApiError(400, 'State name is required');
  const state = await State.create({ name: name.trim() });
  res.status(201).json({ success: true, data: state });
});

export const updateState = catchAsync(async (req, res) => {
  const state = await State.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name?.trim() },
    { new: true, runValidators: true }
  );
  if (!state) throw new ApiError(404, 'State not found');
  res.json({ success: true, data: state });
});

export const deleteState = catchAsync(async (req, res) => {
  const state = await State.findByIdAndDelete(req.params.id);
  if (!state) throw new ApiError(404, 'State not found');
  await Promise.all([
    City.deleteMany({ stateId: state._id }),
    Locality.deleteMany({ stateId: state._id }),
  ]);
  res.json({ success: true, message: 'State deleted' });
});

export const getCities = catchAsync(async (req, res) => {
  const filter = req.query.stateId ? { stateId: req.query.stateId } : {};
  const cities = await City.find(filter).populate('stateId', 'name').sort({ name: 1 });
  res.json({ success: true, data: cities });
});

export const createCity = catchAsync(async (req, res) => {
  const { name, stateId } = req.body;
  if (!name || !stateId) throw new ApiError(400, 'City name and state are required');
  const city = await City.create({ name: name.trim(), stateId });
  res.status(201).json({ success: true, data: city });
});

export const updateCity = catchAsync(async (req, res) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!city) throw new ApiError(404, 'City not found');
  res.json({ success: true, data: city });
});

export const deleteCity = catchAsync(async (req, res) => {
  const city = await City.findByIdAndDelete(req.params.id);
  if (!city) throw new ApiError(404, 'City not found');
  await Locality.deleteMany({ cityId: city._id });
  res.json({ success: true, message: 'City deleted' });
});

export const getLocalities = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.cityId) filter.cityId = req.query.cityId;
  if (req.query.stateId) filter.stateId = req.query.stateId;

  const localities = await Locality.find(filter)
    .populate('cityId', 'name')
    .populate('stateId', 'name')
    .sort({ name: 1 });

  res.json({ success: true, data: localities });
});

export const createLocality = catchAsync(async (req, res) => {
  const { name, cityId } = req.body;
  if (!name || !cityId) throw new ApiError(400, 'Locality name and city are required');

  const city = await City.findById(cityId);
  if (!city) throw new ApiError(400, 'Invalid city');

  const locality = await Locality.create({
    name: name.trim(),
    cityId,
    stateId: city.stateId,
  });
  res.status(201).json({ success: true, data: locality });
});

export const updateLocality = catchAsync(async (req, res) => {
  const locality = await Locality.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!locality) throw new ApiError(404, 'Locality not found');
  res.json({ success: true, data: locality });
});

export const deleteLocality = catchAsync(async (req, res) => {
  const locality = await Locality.findByIdAndDelete(req.params.id);
  if (!locality) throw new ApiError(404, 'Locality not found');
  res.json({ success: true, message: 'Locality deleted' });
});
