import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import {
  getStates,
  getCities,
  getClusters,
  getLocalities,
  createState,
  createCity,
  createCluster,
  createLocality,
  deleteState,
  deleteCity,
  deleteCluster,
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
  const [clusterName, setClusterName] = useState('');
  const [clusterCityId, setClusterCityId] = useState('');
  const [localityName, setLocalityName] = useState('');
  const [localityClusterId, setLocalityClusterId] = useState('');
  const [viewClusterId, setViewClusterId] = useState('');

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities-all'],
    queryFn: () => getCities().then((r) => r.data.data),
  });

  const { data: clusters = [] } = useQuery({
    queryKey: ['clusters-all'],
    queryFn: () => getClusters().then((r) => r.data.data),
  });

  const { data: clusterLocalities = [] } = useQuery({
    queryKey: ['localities', viewClusterId],
    queryFn: () => getLocalities({ clusterId: viewClusterId }).then((r) => r.data.data),
    enabled: !!viewClusterId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['states'] });
    queryClient.invalidateQueries({ queryKey: ['cities-all'] });
    queryClient.invalidateQueries({ queryKey: ['clusters-all'] });
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

  const clusterMutation = useMutation({
    mutationFn: createCluster,
    onSuccess: () => {
      invalidate();
      setClusterName('');
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
      <PageHeader title="Location Management" description="Manage State → City → Cluster → Locality hierarchy" />

      <Tabs defaultValue="states" className="space-y-4">
        <TabsList>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
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
                    <span>{c.name} — {c.stateId?.name || ''}</span>
                    <Button size="sm" variant="ghost" onClick={() => deleteCity(c._id).then(invalidate)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters">
          <Card>
            <CardHeader><CardTitle>Locality Clusters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>City</Label>
                  <Select value={clusterCityId} onValueChange={setClusterCityId}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cluster Name</Label>
                  <Input value={clusterName} onChange={(e) => setClusterName(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => clusterMutation.mutate({ name: clusterName, cityId: clusterCityId })}>Add Cluster</Button>
                </div>
              </div>
              <div className="space-y-2">
                {clusters.map((cl) => (
                  <div key={cl._id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    <button
                      className="text-left hover:text-primary"
                      onClick={() => setViewClusterId(cl._id)}
                    >
                      {cl.name} ({cl.localityCount || 0} Localities) — {cl.cityId?.name}
                    </button>
                    <Button size="sm" variant="ghost" onClick={() => deleteCluster(cl._id).then(invalidate)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {viewClusterId && (
                <Card>
                  <CardHeader><CardTitle>Localities in Cluster</CardTitle></CardHeader>
                  <CardContent>
                    {clusterLocalities.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No localities</p>
                    ) : (
                      <ul className="list-disc pl-5 text-sm">
                        {clusterLocalities.map((l) => <li key={l._id}>{l.name}</li>)}
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
                  <Label>Cluster</Label>
                  <Select value={localityClusterId} onValueChange={setLocalityClusterId}>
                    <SelectTrigger><SelectValue placeholder="Select cluster" /></SelectTrigger>
                    <SelectContent>
                      {clusters.map((cl) => <SelectItem key={cl._id} value={cl._id}>{cl.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Locality Name</Label>
                  <Input value={localityName} onChange={(e) => setLocalityName(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => localityMutation.mutate({ name: localityName, clusterId: localityClusterId })}>
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
