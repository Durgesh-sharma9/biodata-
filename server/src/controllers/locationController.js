import State from '../models/State.js';
import City from '../models/City.js';
import LocalityCluster from '../models/LocalityCluster.js';
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
    LocalityCluster.deleteMany({ stateId: state._id }),
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
  await Promise.all([
    LocalityCluster.deleteMany({ cityId: city._id }),
    Locality.deleteMany({ cityId: city._id }),
  ]);
  res.json({ success: true, message: 'City deleted' });
});

export const getClusters = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.cityId) filter.cityId = req.query.cityId;
  if (req.query.stateId) filter.stateId = req.query.stateId;

  const clusters = await LocalityCluster.find(filter)
    .populate('cityId', 'name')
    .populate('stateId', 'name')
    .sort({ name: 1 });

  const clustersWithCount = await Promise.all(
    clusters.map(async (cluster) => {
      const localityCount = await Locality.countDocuments({ clusterId: cluster._id });
      return { ...cluster.toObject(), localityCount };
    })
  );

  res.json({ success: true, data: clustersWithCount });
});

export const createCluster = catchAsync(async (req, res) => {
  const { name, cityId } = req.body;
  if (!name || !cityId) throw new ApiError(400, 'Cluster name and city are required');

  const city = await City.findById(cityId);
  if (!city) throw new ApiError(400, 'Invalid city');

  const cluster = await LocalityCluster.create({
    name: name.trim(),
    cityId,
    stateId: city.stateId,
  });
  res.status(201).json({ success: true, data: cluster });
});

export const updateCluster = catchAsync(async (req, res) => {
  const cluster = await LocalityCluster.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cluster) throw new ApiError(404, 'Cluster not found');
  res.json({ success: true, data: cluster });
});

export const deleteCluster = catchAsync(async (req, res) => {
  const cluster = await LocalityCluster.findByIdAndDelete(req.params.id);
  if (!cluster) throw new ApiError(404, 'Cluster not found');
  await Locality.deleteMany({ clusterId: cluster._id });
  res.json({ success: true, message: 'Cluster deleted' });
});

export const getLocalities = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.clusterId) filter.clusterId = req.query.clusterId;
  if (req.query.cityId) filter.cityId = req.query.cityId;
  if (req.query.stateId) filter.stateId = req.query.stateId;

  const localities = await Locality.find(filter)
    .populate('clusterId', 'name')
    .populate('cityId', 'name')
    .populate('stateId', 'name')
    .sort({ name: 1 });

  res.json({ success: true, data: localities });
});

export const createLocality = catchAsync(async (req, res) => {
  const { name, clusterId } = req.body;
  if (!name || !clusterId) throw new ApiError(400, 'Locality name and cluster are required');

  const cluster = await LocalityCluster.findById(clusterId);
  if (!cluster) throw new ApiError(400, 'Invalid cluster');

  const locality = await Locality.create({
    name: name.trim(),
    clusterId,
    cityId: cluster.cityId,
    stateId: cluster.stateId,
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
