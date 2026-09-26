import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import { 
  MapPin, 
  Navigation, 
  Search, 
  X, 
  Loader2, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  Building2,
  GraduationCap
} from 'lucide-react';
import { searchLocation, reverseGeocode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Haversine distance calculation in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Custom Leaflet Icons
const createSearchCenterIcon = (label) => L.divIcon({
  className: 'custom-search-marker',
  html: `
    <div style="position: relative; width: 36px; height: 36px;">
      <div style="position: absolute; inset: -6px; border-radius: 50%; background: rgba(160, 90, 255, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #A05AFF, #7928CA); border: 3px solid white; box-shadow: 0 4px 12px rgba(160, 90, 255, 0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
        📍
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const schoolIcon = L.divIcon({
  className: 'custom-school-marker',
  html: `
    <div style="width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #3081e4, #0056b3); border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
      🏫
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const candidateIcon = L.divIcon({
  className: 'custom-candidate-marker',
  html: `
    <div style="width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #1BCFB4, #07cdae); border: 2.5px solid white; box-shadow: 0 3px 8px rgba(27,207,180,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
      👤
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Component to handle map clicks to move search center
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to smoothly fly/pan map to new center
function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center.lat) && !isNaN(center.lng)) {
      map.flyTo([center.lat, center.lng], 13, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center?.lat, center?.lng, map]);
  return null;
}

export function MapView({ 
  candidates = [], 
  schoolLocation, 
  workingRadius = 15,
  onLocationChange,
  height = '480px'
}) {
  const defaultSchoolLat = Number(schoolLocation?.latitude);
  const defaultSchoolLng = Number(schoolLocation?.longitude);
  const hasValidSchoolLoc = !isNaN(defaultSchoolLat) && !isNaN(defaultSchoolLng) && defaultSchoolLat !== 0;

  // Active search center (can be school or user-searched point)
  const [searchCenter, setSearchCenter] = useState({
    lat: hasValidSchoolLoc ? defaultSchoolLat : 28.6139,
    lng: hasValidSchoolLoc ? defaultSchoolLng : 77.2090,
    address: schoolLocation?.address || 'Connaught Place, New Delhi',
  });

  const [radiusKm, setRadiusKm] = useState(Number(workingRadius) || 15);
  const [mapType, setMapType] = useState('google_roadmap'); // 'google_roadmap' | 'google_satellite' | 'osm'
  
  // Search bar states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [showRadiusSelector, setShowRadiusSelector] = useState(false);
  
  const searchTimeoutRef = useRef(null);

  // Sync if schoolLocation changes asynchronously
  useEffect(() => {
    if (hasValidSchoolLoc) {
      setSearchCenter({
        lat: defaultSchoolLat,
        lng: defaultSchoolLng,
        address: schoolLocation.address || 'Your School Campus',
      });
    }
  }, [defaultSchoolLat, defaultSchoolLng, hasValidSchoolLoc, schoolLocation?.address]);

  // Clean candidates with valid coordinates and distance from search center
  const candidatesWithDistance = useMemo(() => {
    return (Array.isArray(candidates) ? candidates : [])
      .map((c) => {
        const latNum = Number(c.latitude);
        const lngNum = Number(c.longitude);
        const isValid = !isNaN(latNum) && !isNaN(lngNum) && latNum !== 0;
        const dist = isValid && searchCenter.lat && searchCenter.lng
          ? calculateDistanceKm(searchCenter.lat, searchCenter.lng, latNum, lngNum)
          : null;

        return {
          ...c,
          latNum,
          lngNum,
          isValid,
          distanceFromSearchKm: dist,
          inRadius: dist !== null ? dist <= radiusKm : false,
        };
      })
      .filter((c) => c.isValid);
  }, [candidates, searchCenter.lat, searchCenter.lng, radiusKm]);

  const candidatesInRadius = useMemo(() => {
    return candidatesWithDistance.filter((c) => c.inRadius);
  }, [candidatesWithDistance]);

  // Location search autocomplete
  const handleSearchInput = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!q.trim() || q.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await searchLocation(q, searchCenter.lat, searchCenter.lng);
        const results = res.data?.data || [];
        setSearchResults(results.slice(0, 6));
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 320);
  };

  // Select location from search dropdown
  const handleSelectResult = (item) => {
    const newLat = Number(item.lat);
    const newLng = Number(item.lon);

    if (!isNaN(newLat) && !isNaN(newLng)) {
      const newPoint = {
        lat: newLat,
        lng: newLng,
        address: item.display_name || item.name || `${newLat.toFixed(4)}, ${newLng.toFixed(4)}`,
      };
      setSearchCenter(newPoint);
      setSearchQuery('');
      setSearchResults([]);
      if (onLocationChange) {
        onLocationChange({
          ...newPoint,
          radiusKm,
          candidatesInRadius: candidatesWithDistance.filter((c) => {
            const dist = calculateDistanceKm(newLat, newLng, c.latNum, c.lngNum);
            return dist !== null && dist <= radiusKm;
          }),
        });
      }
    }
  };

  // Handle map click to re-center search
  const handleMapClick = async (lat, lng) => {
    setIsReverseGeocoding(true);
    let resolved = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    try {
      const res = await reverseGeocode(lat, lng);
      if (res.data?.data?.display_name) {
        resolved = res.data.data.display_name;
      }
    } catch {
      // ignore
    } finally {
      setIsReverseGeocoding(false);
    }

    const newPoint = { lat, lng, address: resolved };
    setSearchCenter(newPoint);
    if (onLocationChange) {
      onLocationChange({
        ...newPoint,
        radiusKm,
        candidatesInRadius: candidatesWithDistance.filter((c) => {
          const dist = calculateDistanceKm(lat, lng, c.latNum, c.lngNum);
          return dist !== null && dist <= radiusKm;
        }),
      });
    }
  };

  // Current GPS Location
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let addr = 'My Current GPS Location';
        try {
          const res = await reverseGeocode(latitude, longitude);
          if (res.data?.data?.display_name) {
            addr = res.data.data.display_name;
          }
        } catch {
          // ignore
        }
        setSearchCenter({ lat: latitude, lng: longitude, address: addr });
        setIsLocating(false);
      },
      (err) => {
        alert('Could not retrieve GPS location: ' + err.message);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Reset to School location
  const handleResetToSchool = () => {
    if (hasValidSchoolLoc) {
      setSearchCenter({
        lat: defaultSchoolLat,
        lng: defaultSchoolLng,
        address: schoolLocation.address || 'School Campus',
      });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 flex flex-col">
      
      {/* ─────────────────────────────────────────────────────────────
          MAP HEADER & SEARCH BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 dark:bg-slate-900/95 dark:border-slate-800 z-10 flex flex-col gap-2.5">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          
          {/* Location Autocomplete Input */}
          <div className="relative flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-[#A05AFF]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search any locality, city, landmark, or pin code on map..."
                className="w-full h-10 pl-9 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
              />
              {isSearching ? (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Loader2 className="w-3.5 h-3.5 text-[#A05AFF] animate-spin" />
                </div>
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    className="w-full p-2.5 px-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-[#A05AFF] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {item.name || item.display_name?.split(',')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.display_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap shrink-0">
            
            {/* GPS Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetGPSLocation}
              disabled={isLocating}
              className="h-10 px-3 text-xs font-bold border-slate-200 text-slate-700 hover:text-[#A05AFF] hover:border-[#A05AFF] rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A05AFF]" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-[#1BCFB4]" />
              )}
              <span className="hidden xs:inline">My GPS</span>
            </Button>

            {/* Reset to School */}
            {hasValidSchoolLoc && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetToSchool}
                className="h-10 px-3 text-xs font-bold border-slate-200 text-slate-700 hover:text-[#A05AFF] hover:border-[#A05AFF] rounded-xl flex items-center gap-1.5 shadow-2xs"
                title="Reset center to School Campus"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#A05AFF]" />
                <span className="hidden xs:inline">Campus</span>
              </Button>
            )}

            {/* Radius Filter Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {[5, 10, 20, 50].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusKm(r)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    radiusKm === r
                      ? 'bg-[#A05AFF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>

            {/* Map Layer Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMapType('google_roadmap')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  mapType === 'google_roadmap'
                    ? 'bg-white dark:bg-slate-900 text-[#A05AFF] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Road
              </button>
              <button
                type="button"
                onClick={() => setMapType('google_satellite')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  mapType === 'google_satellite'
                    ? 'bg-white dark:bg-slate-900 text-[#A05AFF] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Satellite
              </button>
            </div>

          </div>
        </div>

        {/* Live Search Center Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 px-1">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium truncate max-w-xl">
            <span className="font-bold text-[#A05AFF] flex items-center gap-1 shrink-0">
              <MapPin className="w-3.5 h-3.5" /> Searched Spot:
            </span>
            <span className="truncate">{searchCenter.address || `${searchCenter.lat.toFixed(4)}, ${searchCenter.lng.toFixed(4)}`}</span>
            {isReverseGeocoding && <Loader2 className="w-3 h-3 animate-spin text-[#A05AFF] shrink-0" />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#A05AFF]/10 text-[#A05AFF] border border-[#A05AFF]/25">
              🎯 {candidatesInRadius.length} candidate{candidatesInRadius.length === 1 ? '' : 's'} within {radiusKm}km
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              (Click anywhere on map to re-center)
            </span>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          LEAFLET MAP CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative flex-1" style={{ height }}>
        <MapContainer
          center={[searchCenter.lat, searchCenter.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Tile Layer Based On Selected Type */}
          {mapType === 'google_roadmap' && (
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          )}
          {mapType === 'google_satellite' && (
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          )}
          {mapType === 'osm' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {/* Smooth Fly To Map Recenter */}
          <MapFlyTo center={searchCenter} />

          {/* Click Handler to Update Location */}
          <MapClickHandler onLocationSelect={handleMapClick} />

          {/* Search Center Pin */}
          <Marker
            position={[searchCenter.lat, searchCenter.lng]}
            icon={createSearchCenterIcon(searchCenter.address)}
          >
            <Popup>
              <div className="p-2 text-xs space-y-1 min-w-[200px]">
                <div className="font-black text-sm text-[#A05AFF] flex items-center gap-1.5">
                  📍 Searched Search Center
                </div>
                <div className="font-semibold text-slate-700 leading-tight">
                  {searchCenter.address}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Coordinates: {searchCenter.lat.toFixed(4)}, {searchCenter.lng.toFixed(4)}
                </div>
                <div className="pt-1.5 text-[11px] font-bold text-emerald-600 border-t border-slate-100">
                  Radius: {radiusKm} km ({candidatesInRadius.length} Candidates nearby)
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Radius Circle Around Search Center */}
          <Circle
            center={[searchCenter.lat, searchCenter.lng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#A05AFF',
              fillColor: '#A05AFF',
              fillOpacity: 0.12,
              weight: 2,
              dashArray: '4, 4',
            }}
          />

          {/* School Marker if exists and distinct from searchCenter */}
          {hasValidSchoolLoc && (
            <Marker position={[defaultSchoolLat, defaultSchoolLng]} icon={schoolIcon}>
              <Popup>
                <div className="p-2 text-xs">
                  <div className="font-bold text-sm text-slate-900">
                    🏫 {schoolLocation?.schoolName || 'Your School Campus'}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {schoolLocation?.address || 'Registered campus coordinates'}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Candidate Pins */}
          {candidatesWithDistance.map((c) => {
            const dist = c.distanceFromSearchKm;
            return (
              <Marker
                key={c._id || c.id}
                position={[c.latNum, c.lngNum]}
                icon={candidateIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[220px] text-xs">
                    <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                      <span>{c.fullName}</span>
                      {c.inRadius && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-black px-1.5 py-0.2 rounded">
                          In Range
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600 font-medium text-[11px] mt-0.5">
                      {c.position || c.role || 'Educator / Staff'}
                    </div>
                    {c.area && (
                      <div className="text-slate-400 text-[10px] mt-0.5">
                        📍 {c.area}
                      </div>
                    )}
                    {dist !== null && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Distance from search:</span>
                        <span className="text-[#A05AFF]">{dist.toFixed(1)} km</span>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}

export default MapView;
