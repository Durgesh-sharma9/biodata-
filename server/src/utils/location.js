import State from '../models/State.js';
import City from '../models/City.js';

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if ([lat1, lon1, lat2, lon2].some((value) => value === undefined || value === null || value === '')) {
    return null;
  }

  const toRad = (value) => (Number(value) * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(Number(lat2) - Number(lat1));
  const dLon = toRad(Number(lon2) - Number(lon1));
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

export const formatDistanceKm = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined || Number.isNaN(distanceKm)) return '-';
  return `${distanceKm.toFixed(1)} km`;
};

export const buildLocationPayload = async (body = {}) => {
  const payload = {
    state: body.state ?? '',
    city: body.city ?? '',
    area: body.area ?? '',
    address: body.address ?? body.formattedAddress ?? '',
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
