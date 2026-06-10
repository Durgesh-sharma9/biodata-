import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Label>State</Label>
        <Select
          value={stateId}
          onValueChange={(v) => {
            setStateId(v);
            setCityId('');
            setLocalityId('');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
      </div>

      <div>
        <Label>City</Label>
        <Select
          value={cityId}
          onValueChange={(v) => {
            setCityId(v);
            setLocalityId('');
          }}
          disabled={!stateId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
      </div>

      <div>
        <Label>Locality</Label>
        <Select value={localityId} onValueChange={setLocalityId} disabled={!cityId}>
          <SelectTrigger>
            <SelectValue placeholder="Select locality" />
          </SelectTrigger>
          <SelectContent>
            {localities.map((l) => (
              <SelectItem key={l._id} value={l._id}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.locality && <p className="mt-1 text-xs text-destructive">{errors.locality}</p>}
      </div>
    </div>
  );
}
