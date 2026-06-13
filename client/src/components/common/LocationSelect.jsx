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
    if (localityId) {
      onChange?.({ stateId, cityId, localityId });
    }
  }, [stateId, cityId, localityId]);

  return (
    <div className="w-full space-y-2">
      {/* Sub-label group header to provide premium onboarding feedback */}
      <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400">
        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Geographic Alignment Matrix</span>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
        {/* State Selection Dropdown Wrapper */}
        <div className="space-y-1.5 group">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">
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
            <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-background font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Compass className="h-4 w-4 text-muted-foreground/60 group-hover:text-indigo-500 transition-colors shrink-0" />
                <SelectValue placeholder="Select region" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px] shadow-lg border-slate-100 dark:border-slate-800">
              {states.map((s) => (
                <SelectItem key={s._id} value={s._id} className="rounded-lg font-medium py-2.5 cursor-pointer">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1 animate-shake">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.state}</p>
            </div>
          )}
        </div>

        {/* City Selection Dropdown Wrapper */}
        <div className="space-y-1.5 group">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">
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
            <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-background font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50/50 disabled:text-muted-foreground/40 disabled:cursor-not-allowed dark:disabled:bg-slate-900/40 transition-all shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Map className="h-4 w-4 text-muted-foreground/60 group-hover:text-indigo-500 transition-colors shrink-0" />
                <SelectValue placeholder="Select city" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px] shadow-lg border-slate-100 dark:border-slate-800">
              {cities.map((c) => (
                <SelectItem key={c._id} value={c._id} className="rounded-lg font-medium py-2.5 cursor-pointer">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1 animate-shake">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.city}</p>
            </div>
          )}
        </div>

        {/* Locality Selection Dropdown Wrapper */}
        <div className="space-y-1.5 group">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">
            Specific Locality
          </Label>
          <Select value={localityId} onValueChange={setLocalityId} disabled={!cityId}>
            <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-background font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50/50 disabled:text-muted-foreground/40 disabled:cursor-not-allowed dark:disabled:bg-slate-900/40 transition-all shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Navigation className="h-4 w-4 text-muted-foreground/60 group-hover:text-indigo-500 transition-colors shrink-0" />
                <SelectValue placeholder="Select locality" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px] shadow-lg border-slate-100 dark:border-slate-800">
              {localities.map((l) => (
                <SelectItem key={l._id} value={l._id} className="rounded-lg font-medium py-2.5 cursor-pointer">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.locality && (
            <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1 animate-shake">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <p>{errors.locality}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}