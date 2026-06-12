import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import {
  getStates,
  getCities,
  getLocalities,
  createState,
  createCity,
  createLocality,
  deleteState,
  deleteCity,
  deleteLocality,
} from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function Locations() {
  const queryClient = useQueryClient();
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityStateId, setCityStateId] = useState('');
  const [localityName, setLocalityName] = useState('');
  const [localityCityId, setLocalityCityId] = useState('');
  const [viewCityId, setViewCityId] = useState('');

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities-all'],
    queryFn: () => getCities().then((r) => r.data.data),
  });

  const { data: cityLocalities = [] } = useQuery({
    queryKey: ['localities', viewCityId],
    queryFn: () => getLocalities({ cityId: viewCityId }).then((r) => r.data.data),
    enabled: !!viewCityId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['states'] });
    queryClient.invalidateQueries({ queryKey: ['cities-all'] });
    queryClient.invalidateQueries({ queryKey: ['localities'] });
  };

  const stateMutation = useMutation({
    mutationFn: createState,
    onSuccess: () => {
      invalidate();
      setStateName('');
    },
  });

  const cityMutation = useMutation({
    mutationFn: createCity,
    onSuccess: () => {
      invalidate();
      setCityName('');
    },
  });

  const localityMutation = useMutation({
    mutationFn: createLocality,
    onSuccess: () => {
      invalidate();
      setLocalityName('');
    },
  });

  return (
    <div>
      <PageHeader title="Location Management" description="Manage State → City → Locality hierarchy" />

      <Tabs defaultValue="states" className="space-y-4">
        <TabsList>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="localities">Localities</TabsTrigger>
        </TabsList>

        <TabsContent value="states">
          <Card>
            <CardHeader><CardTitle>States</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="State name" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                <Button onClick={() => stateMutation.mutate({ name: stateName })}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {states.map((s) => (
                  <Badge key={s._id} variant="secondary" className="gap-2 px-3 py-1">
                    {s.name}
                    <button onClick={() => deleteState(s._id).then(invalidate)} className="text-destructive">×</button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities">
          <Card>
            <CardHeader><CardTitle>Cities</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>State</Label>
                  <Select value={cityStateId} onValueChange={setCityStateId}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {states.map((s) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City Name</Label>
                  <Input value={cityName} onChange={(e) => setCityName(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => cityMutation.mutate({ name: cityName, stateId: cityStateId })}>Add City</Button>
                </div>
              </div>
              <div className="space-y-1">
                {cities.map((c) => (
                  <div key={c._id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    <button className="text-left hover:text-primary" onClick={() => setViewCityId(c._id)}>
                      {c.name} — {c.stateId?.name || ''}
                    </button>
                    <Button size="sm" variant="ghost" onClick={() => deleteCity(c._id).then(invalidate)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {viewCityId && (
                <Card>
                  <CardHeader><CardTitle>Localities in City</CardTitle></CardHeader>
                  <CardContent>
                    {cityLocalities.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No localities</p>
                    ) : (
                      <ul className="list-disc pl-5 text-sm">
                        {cityLocalities.map((l) => <li key={l._id}>{l.name}</li>)}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localities">
          <Card>
            <CardHeader><CardTitle>Localities</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>City</Label>
                  <Select value={localityCityId} onValueChange={setLocalityCityId}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c._id} value={c._id}>{c.name} ({c.stateId?.name})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Locality Name</Label>
                  <Input value={localityName} onChange={(e) => setLocalityName(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => localityMutation.mutate({ name: localityName, cityId: localityCityId })}>
                    Add Locality
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
