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
    message: `Imported ${statesImported} states and ${citiesImported} cities`,
  });
});

export const searchLocationProxy = catchAsync(async (req, res) => {
  const { q, lat, lon } = req.query;
  if (!q || !q.trim() || q.trim().length < 2) {
    return res.json({ success: true, data: [] });
  }

  const query = q.trim();
  const centerLat = lat ? Number(lat) : null;
  const centerLon = lon ? Number(lon) : null;
  const combinedResults = [];

  // 1. Search DB Cities matching query
  try {
    const dbCities = await City.find({ name: { $regex: query, $options: 'i' } })
      .populate('stateId', 'name')
      .limit(3);

    for (const cityObj of dbCities) {
      combinedResults.push({
        name: cityObj.name,
        city: cityObj.name,
        state: cityObj.stateId?.name || '',
        area: '',
        display_name: `${cityObj.name}, ${cityObj.stateId?.name || 'India'}`,
        isDbCity: true,
      });
    }
  } catch (err) {
    console.error('DB city search error:', err.message);
  }

  // 2. Photon Proximity Search
  let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=7&lang=en`;
  if (centerLat && centerLon) {
    photonUrl += `&lat=${centerLat}&lon=${centerLon}`;
  }

  try {
    const photonRes = await fetch(photonUrl);
    if (photonRes.ok) {
      const photonData = await photonRes.json();
      if (photonData?.features?.length > 0) {
        for (const f of photonData.features) {
          const props = f.properties;
          const coords = f.geometry.coordinates;

          const nameStr = props.name || '';
          const areaStr = props.district || props.suburb || props.street || '';
          const cityStr = props.city || props.town || props.county || props.village || '';
          const stateStr = props.state || '';
          const countryStr = props.country || '';

          const displayParts = [nameStr, areaStr, cityStr, stateStr, countryStr].filter(
            (val, idx, self) => val && self.indexOf(val) === idx
          );

          combinedResults.push({
            lat: coords[1],
            lon: coords[0],
            display_name: displayParts.join(', '),
            name: nameStr || query,
            area: areaStr,
            city: cityStr,
            state: stateStr,
          });
        }
      }
    }
  } catch (err) {
    console.error('Photon search fallback:', err.message);
  }

  // 3. Nominatim Search with Proximity
  if (combinedResults.length < 5) {
    try {
      let nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=7&addressdetails=1`;
      if (centerLat && centerLon) {
        nomUrl += `&viewbox=${centerLon - 0.5},${centerLat + 0.5},${centerLon + 0.5},${centerLat - 0.5}&bounded=0`;
      }
      const nomRes = await fetch(nomUrl, {
        headers: {
          'User-Agent': 'HireHubRecruitmentApp/1.0 (contact@hirehub.com)',
          'Accept-Language': 'en',
        },
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        for (const item of nomData) {
          const addr = item.address || {};
          combinedResults.push({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name,
            name: item.name || query,
            city: addr.city || addr.town || addr.village || addr.county || '',
            state: addr.state || '',
            area: addr.suburb || addr.neighbourhood || addr.road || '',
          });
        }
      }
    } catch (err) {
      console.error('Nominatim search failed:', err.message);
    }
  }

  // Deduplicate results
  const uniqueResults = [];
  const seen = new Set();
  for (const item of combinedResults) {
    const key = item.display_name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(item);
    }
  }

  // Resolve lat/lon for DB cities if missing
  for (const item of uniqueResults) {
    if (item.isDbCity && (!item.lat || !item.lon)) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(item.display_name)}&limit=1`,
          { headers: { 'User-Agent': 'HireHubRecruitmentApp/1.0 (contact@hirehub.com)' } }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData[0]) {
            item.lat = parseFloat(geoData[0].lat);
            item.lon = parseFloat(geoData[0].lon);
          }
        }
      } catch (err) {}
    }
  }

  res.json({ success: true, data: uniqueResults.slice(0, 8) });
});

export const reverseGeocodeProxy = catchAsync(async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.json({ success: false, message: 'Lat and Lon are required' });
  }

  try {
    const photonRes = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`
    );
    if (photonRes.ok) {
      const photonData = await photonRes.json();
      const f = photonData?.features?.[0];
      if (f) {
        const props = f.properties;
        const fullAddr = [props.name, props.street, props.suburb, props.city || props.town, props.state, props.country].filter(Boolean).join(', ');
        return res.json({
          success: true,
          data: {
            positions: positions.map((p) => p.name),
            positionsList: positions,
            subjects: subjects.map((s) => s.name),
            qualifications: qualifications.map((q) => q.name),
            classes: classes.map((c) => c.name),
            display_name: fullAddr || `${lat}, ${lon}`,
            address: {
              state: props.state || '',
              city: props.city || props.town || props.district || '',
              area: props.suburb || props.district || props.street || '',
            },
          },
        });
      }
    }
  } catch (err) {
    console.error('Photon reverse fallback to Nominatim:', err.message);
  }

  try {
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'HireHubRecruitmentApp/1.0 (contact@hirehub.com)',
          'Accept-Language': 'en',
        },
      }
    );
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      return res.json({ success: true, data: nomData });
    }
  } catch (err) {
    console.error('Nominatim reverse failed:', err.message);
  }

  res.json({ success: true, data: { display_name: `${lat}, ${lon}`, address: {} } });
});
