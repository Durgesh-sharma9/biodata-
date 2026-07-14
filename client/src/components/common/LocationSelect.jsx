import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Compass, Map, MapPin, AlertCircle, Navigation, Crosshair, Ruler } from 'lucide-react';
import { getStates, getCities } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LocationSelect({ value = {}, onChange, errors = {} }) {
  const [stateId, setStateId] = useState(value.stateId || '');
  const [cityId, setCityId] = useState(value.cityId || '');
  const [area, setArea] = useState(value.area || '');
  const [address, setAddress] = useState(value.address || '');
  const [latitude, setLatitude] = useState(value.latitude ?? '');
  const [longitude, setLongitude] = useState(value.longitude ?? '');
  const [workingRadius, setWorkingRadius] = useState(value.workingRadius ?? '');
  const [locationQuery, setLocationQuery] = useState(value.address || '');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => getCities(stateId).then((r) => r.data.data),
    enabled: !!stateId,
  });

  const { data: localities = [] } = useQuery({
    queryKey: ['noop-localities'],
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });

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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setAddress((prev) => prev || 'Current location');
        setLocationQuery((prev) => prev || 'Current location');
      },
      () => {}
    );
  };

  const handleSearchLocation = async () => {
    const query = locationQuery.trim();
    if (!query) return;

    setIsSearchingLocation(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const result = data?.[0];
      if (!result) return;
      setAddress(result.display_name || query);
      setLatitude(String(result.lat));
      setLongitude(String(result.lon));
      setLocationQuery(result.display_name || query);
    } catch (error) {
      console.error('Location search failed', error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Sub-label group header formatted to exact metadata specifications */}
      <div className="flex items-center gap-1.5 mb-1 text-slate-400 dark:text-slate-500">
        <MapPin className="h-3.5 w-3.5 text-[#A05AFF]" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Geographic Alignment Matrix</span>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* State Selection Dropdown Wrapper */}
        <div className="space-y-1.5 group">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">
            State / Region
          </Label>
          <Select
            value={stateId}
            onValueChange={(v) => {
              setStateId(v);
              setCityId('');
              setArea('');
            }}
          >
            <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-white dark:bg-slate-900 font-medium focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 transition-all shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Compass className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#A05AFF] transition-colors shrink-0" />
                <SelectValue placeholder="Select region" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px] shadow-sm border-none bg-white dark:bg-slate-900">
              {states.map((s) => (
                <SelectItem key={s._id} value={s._id} className="rounded-lg font-medium py-2.5 cursor-pointer">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FE9496] mt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.state}</p>
            </div>
          )}
        </div>

        {/* City Selection Dropdown Wrapper */}
        <div className="space-y-1.5 group">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">
            City / Territory
          </Label>
          <Select
            value={cityId}
            onValueChange={(v) => {
              setCityId(v);
              setArea('');
            }}
            disabled={!stateId}
          >
            <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-white dark:bg-slate-900 font-medium focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 disabled:bg-slate-50/50 disabled:text-slate-400/40 disabled:cursor-not-allowed dark:disabled:bg-slate-900/40 transition-all shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Map className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#A05AFF] transition-colors shrink-0" />
                <SelectValue placeholder="Select city" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px] shadow-sm border-none bg-white dark:bg-slate-900">
              {cities.map((c) => (
                <SelectItem key={c._id} value={c._id} className="rounded-lg font-medium py-2.5 cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FE9496] mt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.city}</p>
            </div>
          )}
        </div>

        {/* Area (free-text) and Address fields */}
        <div className="space-y-2 md:col-span-3">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Area</Label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area, landmark (e.g., Mahapura, Vaishali Nagar)"
            className="w-full rounded-xl h-11 border-slate-200 bg-white px-3 font-medium shadow-xs"
          />
          {errors.area && (
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FE9496] mt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.area}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-3">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Address</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setLocationQuery(e.target.value);
              }}
              placeholder="Search or enter a precise address"
              className="rounded-xl h-11 border-slate-200 bg-white shadow-xs"
            />
            <button
              type="button"
              onClick={handleSearchLocation}
              disabled={isSearchingLocation}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              {isSearchingLocation ? 'Searching...' : 'Search location'}
            </button>
          </div>
        </div>

        <div className="space-y-2 md:col-span-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Crosshair className="h-3.5 w-3.5 text-[#A05AFF]" />
            Map location details
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Latitude</Label>
              <Input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 26.9124" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Longitude</Label>
              <Input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 75.7873" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Working Radius (km)</Label>
              <Input value={workingRadius} onChange={(e) => setWorkingRadius(e.target.value)} placeholder="e.g. 10" />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              <Navigation className="h-3.5 w-3.5" />
              Use current location
            </button>
            {(latitude || longitude) && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-[#A05AFF]" />
                Pin ready • {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}