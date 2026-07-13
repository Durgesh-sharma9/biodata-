import State from '../models/State.js';
import City from '../models/City.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { State as CSCState, City as CSCCity } from 'country-state-city';

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
  res.json({ success: true, message: 'City deleted' });
});

// Locality master removed — operations for states and cities remain.

export const importIndiaLocations = catchAsync(async (req, res) => {
  const indianStates = CSCState.getStatesOfCountry('IN');
  let statesImported = 0;
  let citiesImported = 0;

  for (const stateData of indianStates) {
    const existingState = await State.findOne({ name: stateData.name });
    let stateId;

    if (!existingState) {
      const newState = await State.create({
        name: stateData.name,
        code: stateData.isoCode,
      });
      stateId = newState._id;
      statesImported++;
    } else {
      stateId = existingState._id;
    }

    const cities = CSCCity.getCitiesOfState('IN', stateData.isoCode);
    
    for (const cityData of cities) {
      const existingCity = await City.findOne({
        name: cityData.name,
        stateId: stateId,
      });

      if (!existingCity) {
        await City.create({
          name: cityData.name,
          stateId: stateId,
        });
        citiesImported++;
      }
    }
  }

  res.json({
    success: true,
    message: 'India locations imported successfully',
    data: {
      statesImported,
      citiesImported,
    },
  });
});
