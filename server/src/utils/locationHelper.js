import Locality from '../models/Locality.js';
import City from '../models/City.js';
import State from '../models/State.js';
import { ApiError } from './ApiError.js';

export const resolveLocationFromLocalityId = async (localityId) => {
  const locality = await Locality.findById(localityId).populate('cityId stateId');
  if (!locality) throw new ApiError(400, 'Invalid locality selected');

  const city = locality.cityId;
  const state = locality.stateId;

  return {
    state: state?.name || '',
    city: city?.name || '',
    locality: locality.name,
    stateId: state?._id,
    cityId: city?._id,
    localityId: locality._id,
  };
};

export const getLocationHierarchy = async () => {
  const states = await State.find().sort({ name: 1 });
  const cities = await City.find().sort({ name: 1 });
  const localities = await Locality.find().sort({ name: 1 });

  return { states, cities, localities };
};
