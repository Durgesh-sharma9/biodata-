import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Crosshair, ChevronDown, Check } from 'lucide-react';
import { getStates, getCities } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SchoolLocationPicker } from '@/components/common/SchoolLocationPicker';

export function LocationSelect({ value = {}, onChange, errors = {} }) {
  const [stateId, setStateId] = useState(value.stateId || '');
  const [cityId, setCityId] = useState(value.cityId || '');
  const [area, setArea] = useState(value.area || '');
  const [address, setAddress] = useState(value.address || '');
  const [latitude, setLatitude] = useState(value.latitude ?? '');
  const [longitude, setLongitude] = useState(value.longitude ?? '');
  const [workingRadius, setWorkingRadius] = useState(value.workingRadius ?? '');

  // Searchable combobox states
  const [stateSearch, setStateSearch] = useState('');
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => getCities(stateId).then((r) => r.data.data),
    enabled: !!stateId,
  });

  // Sync state & city search text with selected props / IDs
  useEffect(() => {
    if (stateId && states.length > 0) {
      const matched = states.find((s) => s._id === stateId);
      if (matched) setStateSearch(matched.name);
    } else if (!stateId) {
      setStateSearch('');
    }
  }, [stateId, states]);

  useEffect(() => {
    if (cityId && cities.length > 0) {
      const matched = cities.find((c) => c._id === cityId);
      if (matched) setCitySearch(matched.name);
    } else if (!cityId) {
      setCitySearch('');
    }
  }, [cityId, cities]);

  useEffect(() => {
    if (value.latitude !== undefined && value.latitude !== null && value.latitude !== '') setLatitude(value.latitude);
    if (value.longitude !== undefined && value.longitude !== null && value.longitude !== '') setLongitude(value.longitude);
    if (value.stateId) setStateId(value.stateId);
    if (value.cityId) setCityId(value.cityId);
    if (value.area) setArea(value.area);
    if (value.address) setAddress(value.address);
    if (value.workingRadius) setWorkingRadius(value.workingRadius);
  }, [value.latitude, value.longitude, value.stateId, value.cityId, value.area, value.address, value.workingRadius]);

  useEffect(() => {
    const normalizedLatitude = latitude === '' ? undefined : Number(latitude);
    const normalizedLongitude = longitude === '' ? undefined : Number(longitude);
    const normalizedWorkingRadius = workingRadius === '' ? undefined : Number(workingRadius);
    onChange?.({
      stateId,
      cityId,
      area,
      address,
      latitude: Number.isNaN(normalizedLatitude) ? undefined : normalizedLatitude,
      longitude: Number.isNaN(normalizedLongitude) ? undefined : normalizedLongitude,
      workingRadius: Number.isNaN(normalizedWorkingRadius) ? undefined : normalizedWorkingRadius,
    });
  }, [stateId, cityId, area, address, latitude, longitude, workingRadius, onChange]);

  const handleMapLocationChange = ({ latitude: lat, longitude: lng }) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
  };

  const handleMapAddressResolved = (details) => {
    if (details) {
      if (details.state) {
        const matchedState = states.find((s) => s.name.toLowerCase().includes(details.state.toLowerCase()));
        if (matchedState) {
          setStateId(matchedState._id);
          setStateSearch(matchedState.name);
        }
      }
      if (details.area && !area) setArea(details.area);
      if (details.address && !address) setAddress(details.address);
    }
  };

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase().trim())
  );

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase().trim())
  );

  return (
    <div className="w-full space-y-4 antialiased">
      {/* Header */}
      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
        <MapPin className="h-4 w-4 text-[#A05AFF]" />
        <span className="text-xs font-bold uppercase tracking-wider">Candidate Location & Map Pin</span>
      </div>

      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
        {/* Searchable State Selection Combobox */}
        <div className="space-y-1 relative">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">State / Region</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Type to search state (e.g. Rajasthan, Delhi)..."
              value={stateSearch}
              onChange={(e) => {
                setStateSearch(e.target.value);
                setIsStateOpen(true);
                if (!e.target.value) {
                  setStateId('');
                  setCityId('');
                  setCitySearch('');
                }
              }}
              onFocus={() => setIsStateOpen(true)}
              className="rounded-lg h-9 border-slate-200 bg-white font-medium text-xs focus-visible:ring-[#A05AFF] pr-8"
            />
            <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {isStateOpen && (
            <>
              <div className="fixed inset-0 z-[9990]" onClick={() => setIsStateOpen(false)} />
              <div className="absolute left-0 right-0 top-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs z-[9999]">
                {filteredStates.length === 0 ? (
                  <div className="p-3 text-slate-400 text-center font-medium">No matching states found</div>
                ) : (
                  filteredStates.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => {
                        setStateId(s._id);
                        setStateSearch(s.name);
                        setCityId('');
                        setCitySearch('');
                        setIsStateOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-slate-800 font-medium transition-colors flex items-center justify-between ${s._id === stateId ? 'bg-purple-50 text-[#A05AFF] font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      <span>{s.name}</span>
                      {s._id === stateId && <Check className="h-3.5 w-3.5 text-[#A05AFF]" />}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
          {errors.state && <p className="text-[11px] font-semibold text-rose-500 mt-0.5">{errors.state}</p>}
        </div>

        {/* Searchable City Selection Combobox */}
        <div className="space-y-1 relative">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">City / District</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder={stateId ? 'Type to search city (e.g. Jaipur, Kota)...' : 'Select a state first'}
              value={citySearch}
              disabled={!stateId}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setIsCityOpen(true);
                if (!e.target.value) setCityId('');
              }}
              onFocus={() => {
                if (stateId) setIsCityOpen(true);
              }}
              className="rounded-lg h-9 border-slate-200 bg-white font-medium text-xs focus-visible:ring-[#A05AFF] pr-8 disabled:bg-slate-100"
            />
            <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {isCityOpen && stateId && (
            <>
              <div className="fixed inset-0 z-[9990]" onClick={() => setIsCityOpen(false)} />
              <div className="absolute left-0 right-0 top-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs z-[9999]">
                {filteredCities.length === 0 ? (
                  <div className="p-3 text-slate-400 text-center font-medium">No matching cities found</div>
                ) : (
                  filteredCities.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => {
                        setCityId(c._id);
                        setCitySearch(c.name);
                        setIsCityOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-slate-800 font-medium transition-colors flex items-center justify-between ${c._id === cityId ? 'bg-purple-50 text-[#A05AFF] font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      <span>{c.name}</span>
                      {c._id === cityId && <Check className="h-3.5 w-3.5 text-[#A05AFF]" />}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
          {errors.city && <p className="text-[11px] font-semibold text-rose-500 mt-0.5">{errors.city}</p>}
        </div>

        {/* Area */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Area / Locality</Label>
          <Input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., Connaught Place, Lajpat Nagar"
            className="rounded-lg h-9 border-slate-200 text-xs font-medium focus-visible:ring-[#A05AFF]"
          />
        </div>

        {/* Full Address */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House/Apartment no, street, landmark..."
            className="rounded-lg h-9 border-slate-200 text-xs font-medium focus-visible:ring-[#A05AFF]"
          />
        </div>
      </div>

      {/* Interactive Map Picker Component */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Crosshair className="h-4 w-4 text-[#A05AFF]" />
            Pin Candidate Location on Map
          </Label>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">Search address or drag pin to adjust coordinates</span>
        </div>

        <SchoolLocationPicker
          initialLocation={{ latitude, longitude, address }}
          onLocationChange={handleMapLocationChange}
          onAddressResolved={handleMapAddressResolved}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-slate-500">Latitude</Label>
            <Input 
              value={latitude} 
              onChange={(e) => setLatitude(e.target.value)} 
              placeholder="e.g. 28.6139" 
              className="rounded-lg h-8 text-xs font-mono bg-slate-50 dark:bg-slate-950 border-slate-200" 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-slate-500">Longitude</Label>
            <Input 
              value={longitude} 
              onChange={(e) => setLongitude(e.target.value)} 
              placeholder="e.g. 77.2090" 
              className="rounded-lg h-8 text-xs font-mono bg-slate-50 dark:bg-slate-950 border-slate-200" 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-slate-500">Working Radius (km)</Label>
            <Input 
              type="number" 
              value={workingRadius} 
              onChange={(e) => setWorkingRadius(e.target.value)} 
              placeholder="e.g. 10" 
              className="rounded-lg h-8 text-xs font-medium border-slate-200 focus-visible:ring-[#A05AFF]" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}