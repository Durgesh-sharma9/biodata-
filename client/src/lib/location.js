export const formatCandidateLocation = (candidate = {}) => {
  const area = candidate.area?.trim();
  const city = candidate.city?.trim();

  if (area && city) return `${area}, ${city}`;
  if (area) return area;
  if (city) return city;
  return '-';
};

export const buildLocationSearchText = (candidate = {}) => {
  return [candidate.fullName, candidate.mobile, candidate.position, candidate.state, candidate.city, candidate.area, candidate.address]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if ([lat1, lon1, lat2, lon2].some((value) => value === undefined || value === null || value === '')) {
    return null;
  }

  const toRad = (value) => (Number(value) * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};
