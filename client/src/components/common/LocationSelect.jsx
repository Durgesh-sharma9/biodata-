import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Compass, Map, Navigation, MapPin, AlertCircle } from 'lucide-react';
import { getStates, getCities, getLocalities } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LocationSelect({ value = {}, onChange, errors = {} }) {
  const [stateId, setStateId] = useState(value.stateId || '');
  const [cityId, setCityId] = useState(value.cityId || '');
  const [localityId, setLocalityId] = useState(value.localityId || '');

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
    queryKey: ['localities', cityId],
    queryFn: () => getLocalities({ cityId }).then((r) => r.data.data),
    enabled: !!cityId,
  });

  useEffect(() => {
    onChange?.({ stateId, cityId, localityId });
  }, [stateId, cityId, localityId, onChange]);

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
              setLocalityId('');
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
              setLocalityId('');
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

        {/* Locality Selection Dropdown Wrapper */}
        <div className="space-y-1.5 group">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors">
            Specific Locality
          </Label>
          <Select value={localityId} onValueChange={setLocalityId} disabled={!cityId}>
            <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-white dark:bg-slate-900 font-medium focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 disabled:bg-slate-50/50 disabled:text-slate-400/40 disabled:cursor-not-allowed dark:disabled:bg-slate-900/40 transition-all shadow-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Navigation className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#A05AFF] transition-colors shrink-0" />
                <SelectValue placeholder="Select locality" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px] shadow-sm border-none bg-white dark:bg-slate-900">
              {localities.map((l) => (
                <SelectItem key={l._id} value={l._id} className="rounded-lg font-medium py-2.5 cursor-pointer">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.locality && (
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FE9496] mt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.locality}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}