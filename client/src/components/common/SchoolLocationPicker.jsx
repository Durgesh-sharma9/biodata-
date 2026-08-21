import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, Loader2, Search, Sparkles, Check, RotateCcw, Map as MapIcon, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const markerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #A05AFF; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(160,90,255,0.4); display: flex; align-items: center; justify-content: center; transform: translate(-2px, -2px);"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; margin: auto;"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect, disabled }) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Component to smoothly animate and re-center map
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], 15, { animate: true, duration: 1.2 });
    }
  }, [center?.lat, center?.lng, map]);
  return null;
}

export function SchoolLocationPicker({ initialLocation, onLocationChange, onAddressResolved, disabled = false }) {
  const [location, setLocation] = useState({
    lat: Number(initialLocation?.latitude) || 28.6139,
    lng: Number(initialLocation?.longitude) || 77.2090,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState(null);
  const markerRef = useRef(null);

  // Sync initial location when props arrive asynchronously
  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      const lat = Number(initialLocation.latitude);
      const lng = Number(initialLocation.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({ lat, lng });
      }
    }
  }, [initialLocation?.latitude, initialLocation?.longitude]);

  // Reverse geocoding helper (OSM Nominatim)
  const fetchAddressDetails = useCallback(async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const state = addr.state || addr.province || '';
        const city = addr.city || addr.town || addr.village || addr.county || addr.suburb || '';
        const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
        const fullAddr = data.display_name || '';

        const details = { state, city, area, address: fullAddr };
        setResolvedAddress(fullAddr);
        
        if (onAddressResolved) {
          onAddressResolved(details);
        }
      }
    } catch (err) {
      setResolvedAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsGeocoding(false);
    }
  }, [onAddressResolved]);

  // Handle location update
  const handleLocationSelect = useCallback((lat, lng) => {
    if (disabled) return;
    const roundLat = Number(lat.toFixed(6));
    const roundLng = Number(lng.toFixed(6));
    setLocation({ lat: roundLat, lng: roundLng });
    onLocationChange({ latitude: roundLat, longitude: roundLng });
    fetchAddressDetails(roundLat, roundLng);
  }, [disabled, onLocationChange, fetchAddressDetails]);

  // Handle marker dragend
  const handleMarkerDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker != null) {
      const { lat, lng } = marker.getLatLng();
      handleLocationSelect(lat, lng);
    }
  }, [handleLocationSelect]);

  // Location search handler (Forward Geocoding)
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      if (data && data.length > 0) {
        setSearchResults(data);
        if (data.length === 1) {
          selectSearchResult(data[0]);
        }
      } else {
        setError('No location matches found. Try searching with city or landmark name.');
      }
    } catch (err) {
      setError('Search service unavailable. Please click directly on the map to pin your location.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      handleLocationSelect(lat, lng);
      setSearchResults([]);
      setSearchQuery(item.display_name.split(',')[0]);
    }
  };

  // Browser GPS Geolocation
  const handleGetCurrentLocation = () => {
    if (disabled) return;
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSelect(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        setError('Unable to retrieve your GPS position. Please allow location permissions in your browser.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3.5 antialiased">
      {/* Top Search & Actions Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search address, landmark or city (e.g. Connaught Place, New Delhi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            className="w-full pl-9 pr-20 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/50 text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
              className="absolute right-12 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={disabled || isSearching || !searchQuery.trim()}
            className="absolute right-1 top-1 h-7 px-2.5 bg-[#A05AFF] hover:bg-[#9045EE] disabled:opacity-50 text-white rounded-md text-[11px] font-bold transition-all flex items-center gap-1"
          >
            {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLocating}
          className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-slate-700 shrink-0"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 text-[#A05AFF] animate-spin" />
              <span>Locating...</span>
            </>
          ) : (
            <>
              <Navigation className="h-3.5 w-3.5 text-[#A05AFF]" />
              <span>Use My GPS</span>
            </>
          )}
        </button>
      </div>

      {/* Search Results Dropdown List */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {searchResults.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectSearchResult(item)}
              className="w-full text-left p-2.5 hover:bg-purple-50 dark:hover:bg-slate-800 flex items-start gap-2 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-[#A05AFF] shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-300 font-medium leading-tight truncate">{item.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error Alert Banner */}
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-600 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Interactive Map Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={14}
          style={{ height: '320px', width: '100%' }}
          className={disabled ? 'opacity-50 pointer-events-none' : ''}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable={!disabled}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
            position={[location.lat, location.lng]}
            icon={markerIcon}
            ref={markerRef}
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} disabled={disabled} />
          <MapRecenter center={location} />
        </MapContainer>

        {/* Floating Instruction Overlay Badge */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between text-xs gap-2 z-[1000]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 rounded-full bg-[#A05AFF] animate-ping shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
              {isGeocoding ? (
                <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin text-[#A05AFF]" /> Resolving address...</span>
              ) : resolvedAddress ? (
                <span className="font-semibold text-slate-800 dark:text-white truncate">{resolvedAddress}</span>
              ) : (
                <span>Lat: {location.lat}, Lng: {location.lng}</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
            <span className="bg-purple-50 text-[#A05AFF] border border-[#A05AFF]/30 px-2 py-0.5 rounded-md font-bold hidden sm:inline-block">
              Drag Pin or Click Map
            </span>
          </div>
        </div>
      </div>

      {/* Lat/Lng Technical Indicator footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono px-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#A05AFF]" />
          <span>Coordinates: <strong>{location.lat}</strong>, <strong>{location.lng}</strong></span>
        </div>
        <span>Click or Drag marker to adjust exact coordinates</span>
      </div>
    </div>
  );
}
