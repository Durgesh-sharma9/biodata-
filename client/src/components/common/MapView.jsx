import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const schoolIcon = L.divIcon({
  className: 'custom-school-marker',
  html: `<div style="background-color: #A05AFF; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const candidateIcon = L.divIcon({
  className: 'custom-candidate-marker',
  html: `<div style="background-color: #1BCFB4; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export function MapView({ candidates, schoolLocation, workingRadius }) {
  const center = schoolLocation?.latitude && schoolLocation?.longitude
    ? [schoolLocation.latitude, schoolLocation.longitude]
    : candidates?.[0]?.latitude && candidates?.[0]?.longitude
    ? [candidates[0].latitude, candidates[0].longitude]
    : [26.9124, 75.7873];

  const candidatesWithLocation = candidates?.filter(c => c.latitude && c.longitude) || [];

  return (
    <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {schoolLocation?.latitude && schoolLocation?.longitude && (
        <>
          <Marker
            position={[schoolLocation.latitude, schoolLocation.longitude]}
            icon={schoolIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="font-bold text-sm">Your School</p>
                <p className="text-xs text-slate-500">Hiring Location</p>
              </div>
            </Popup>
          </Marker>

          {workingRadius && (
            <Circle
              center={[schoolLocation.latitude, schoolLocation.longitude]}
              radius={workingRadius * 1000}
              pathOptions={{ color: '#A05AFF', fillColor: '#A05AFF', fillOpacity: 0.1 }}
            />
          )}
        </>
      )}

      {candidatesWithLocation.map((candidate) => (
        <Marker
          key={candidate._id}
          position={[candidate.latitude, candidate.longitude]}
          icon={candidateIcon}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <p className="font-bold text-sm">{candidate.fullName}</p>
              <p className="text-xs text-slate-600">{candidate.position}</p>
              <p className="text-xs text-slate-500 mt-1">{candidate.area || candidate.address}</p>
              {candidate.distanceKm !== undefined && candidate.distanceKm !== null && (
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#A05AFF]">
                  <MapPin className="h-3 w-3" />
                  {candidate.distanceKm.toFixed(1)} km away
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
