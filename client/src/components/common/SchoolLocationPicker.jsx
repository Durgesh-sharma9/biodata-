import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
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
  html: `<div style="background-color: #A05AFF; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

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

export function SchoolLocationPicker({ initialLocation, onLocationChange, disabled = false }) {
  const [location, setLocation] = useState(
    initialLocation?.latitude && initialLocation?.longitude
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : { lat: 26.9124, lng: 75.7873 }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSelect = (lat, lng) => {
    if (disabled) return;
    setLocation({ lat, lng });
    onLocationChange({ latitude: lat, longitude: lng });
  };

  const handleGetCurrentLocation = () => {
    if (disabled) return;
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        onLocationChange({ latitude, longitude });
        setIsLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Use Current Location
            </>
          )}
        </button>
        <span className="text-xs text-slate-500">or click on the map to select</span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="relative">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: '300px', width: '100%', borderRadius: '12px' }}
          className={disabled ? 'opacity-50 pointer-events-none' : ''}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]} icon={markerIcon} />
          <MapClickHandler onLocationSelect={handleLocationSelect} disabled={disabled} />
        </MapContainer>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <MapPin className="h-4 w-4" />
        <span>
          Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </span>
      </div>
    </div>
  );
}
