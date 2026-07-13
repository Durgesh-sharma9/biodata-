import State from '../models/State.js';
import City from '../models/City.js';

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export const buildLocationPayload = async (body = {}) => {
  const payload = {
    state: body.state ?? '',
    city: body.city ?? '',
    area: body.area ?? '',
    address: body.address ?? '',
    latitude: toNumberOrUndefined(body.latitude),
    longitude: toNumberOrUndefined(body.longitude),
    workingRadius: toNumberOrUndefined(body.workingRadius),
    stateId: body.stateId ?? null,
    cityId: body.cityId ?? null,
  };

  if (payload.cityId) {
    const city = await City.findById(payload.cityId).populate('stateId');
    if (city) {
      payload.city = city.name;
      payload.state = city.stateId?.name || payload.state;
      payload.cityId = city._id;
      payload.stateId = city.stateId?._id || payload.stateId;
    }
  } else if (payload.stateId) {
    const state = await State.findById(payload.stateId);
    if (state) {
      payload.state = state.name;
      payload.stateId = state._id;
    }
  }

  return payload;
};

export const syncCandidateLocation = async (candidate, body = {}) => {
  const locationKeys = ['state', 'city', 'area', 'address', 'stateId', 'cityId', 'latitude', 'longitude', 'workingRadius'];
  const hasLocationPayload = locationKeys.some((field) => Object.prototype.hasOwnProperty.call(body, field));

  if (!hasLocationPayload) return;

  const locationPayload = await buildLocationPayload(body);
  Object.assign(candidate, locationPayload);
};
