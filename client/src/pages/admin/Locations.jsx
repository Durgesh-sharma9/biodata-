import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, MapPin, Plus, Eye, Navigation, Globe, Building2, Layers, Compass, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

export default function Locations() {
  const queryClient = useQueryClient();
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityStateId, setCityStateId] = useState('');
  const [localityName, setLocalityName] = useState('');
  const [localityCityId, setLocalityCityId] = useState('');
  const [viewCityId, setViewCityId] = useState('');

  const { data: states = [], isLoading: statesLoading } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities-all'],
    queryFn: () => getCities().then((r) => r.data.data),
  });

  const { data: cityLocalities = [], isFetching: localitiesFetching } = useQuery({
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Modern Dashboard Layout Header */}
      <div className="border-b border-slate-100 pb-5">
        <PageHeader 
          title="Location Management" 
          description="Configure and audit the structural region parameters spanning State → City → Locality networks." 
        />
      </div>

      <Tabs defaultValue="states" className="w-full space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-100/80 backdrop-blur-sm p-1 text-slate-500 border border-slate-200/40 shadow-inner/5">
          <TabsTrigger value="states" className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ease-out data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md active:scale-[0.97]">
            <Globe className="h-4 w-4" />
            States ({states.length})
          </TabsTrigger>
          <TabsTrigger value="cities" className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ease-out data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md active:scale-[0.97]">
            <Building2 className="h-4 w-4" />
            Cities ({cities.length})
          </TabsTrigger>
          <TabsTrigger value="localities" className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ease-out data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md active:scale-[0.97]">
            <Navigation className="h-4 w-4" />
            Localities Add
          </TabsTrigger>
        </TabsList>

        {/* States Tab Section */}
        <TabsContent value="states" className="outline-none focus:outline-none focus:ring-0 animate-in fade-in-30 slide-in-from-bottom-2 duration-300">
          <Card className="border border-slate-100 bg-white/90 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-6 sm:p-8 bg-gradient-to-b from-slate-50/40 to-transparent">
              <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                Regional States Network
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex gap-3 max-w-xl group">
                <div className="relative flex-1">
                  <Compass className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    placeholder="Enter new state identifier (e.g. Rajasthan)" 
                    value={stateName} 
                    onChange={(e) => setStateName(e.target.value)} 
                    className="pl-10 h-11 border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <Button 
                  onClick={() => stateMutation.mutate({ name: stateName })}
                  disabled={stateMutation.isPending || !stateName.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold h-11 px-5 rounded-xl shadow-md shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 flex items-center gap-2"
                >
                  {stateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                  Add State
                </Button>
              </div>

              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/30">
                <Label className="mb-3 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">Registered States Directory</Label>
                {statesLoading ? (
                  <div className="flex items-center gap-2 py-4 text-slate-400 font-medium text-sm animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading states catalog...
                  </div>
                ) : states.length === 0 ? (
                  <p className="text-sm font-medium text-slate-400 italic py-2">No regional states configured in platform ledger yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {states.map((s) => (
                      <Badge 
                        key={s._id} 
                        variant="outline" 
                        className="gap-2.5 pl-3.5 pr-2 py-1.5 bg-gradient-to-r from-white to-slate-50/50 border-slate-200 shadow-sm rounded-xl text-slate-700 font-semibold text-xs hover:border-indigo-200 hover:bg-indigo-50/20 transition-all duration-200 animate-in fade-in zoom-in-95"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {s.name}
                        <button 
                          onClick={() => deleteState(s._id).then(invalidate)} 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-all ml-1"
                          title={`Remove ${s.name}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cities Tab Section */}
        <TabsContent value="cities" className="outline-none focus:outline-none focus:ring-0 animate-in fade-in-30 slide-in-from-bottom-2 duration-300">
          <Card className="border border-slate-100 bg-white/90 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-6 sm:p-8 bg-gradient-to-b from-slate-50/40 to-transparent">
              <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-500" />
                Urban Cities Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-3 items-end rounded-xl border border-slate-100 bg-slate-50/30 p-5 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent State Attachment</Label>
                  <Select value={cityStateId} onValueChange={setCityStateId}>
                    <SelectTrigger className="bg-white"><SelectValue placeholder="Choose state map context" /></SelectTrigger>
                    <SelectContent>
                      {states.map((s) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">City Nomenclature Name</Label>
                  <Input 
                    placeholder="e.g. Jaipur"
                    value={cityName} 
                    onChange={(e) => setCityName(e.target.value)} 
                    className="h-11 border-slate-200 bg-white rounded-xl focus:bg-white"
                  />
                </div>
                <Button 
                  onClick={() => cityMutation.mutate({ name: cityName, stateId: cityStateId })}
                  disabled={cityMutation.isPending || !cityName.trim() || !cityStateId}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold h-11 rounded-xl shadow-md shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {cityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                  Add City Node
                </Button>
              </div>

              {/* Dynamic Split Layout Split Panel */}
              <div className="grid gap-6 md:grid-cols-5 items-start">
                {/* Cities Directory Row Matrix */}
                <div className="md:col-span-3 space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar border border-slate-100 rounded-xl p-4 bg-slate-50/10">
                  <Label className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Registered Urban Hubs</Label>
                  {citiesLoading ? (
                    <div className="flex items-center gap-2 py-4 text-slate-400 font-medium text-sm pl-1 animate-pulse">
                      <Loader2 className="h-4 w-4 animate-spin" /> Fetching cities register...
                    </div>
                  ) : cities.length === 0 ? (
                    <p className="text-sm font-medium text-slate-400 italic py-2 pl-1">No cities mapped to state parameters yet.</p>
                  ) : (
                    cities.map((c) => (
                      <div 
                        key={c._id} 
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                          viewCityId === c._id 
                            ? "border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50/40 text-indigo-700 shadow-sm" 
                            : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/60"
                        )}
                      >
                        <button 
                          className="text-left flex-1 font-semibold flex items-center gap-2 truncate" 
                          onClick={() => setViewCityId(c._id)}
                        >
                          <Building2 className={cn("h-3.5 w-3.5 text-slate-400", viewCityId === c._id && "text-indigo-500")} />
                          <span>{c.name}</span>
                          <span className={cn("text-[11px] font-bold uppercase tracking-wider text-slate-300 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md", viewCityId === c._id && "text-indigo-400 bg-white border-indigo-100/50")}>
                            {c.stateId?.name || 'Global'}
                          </span>
                        </button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteCity(c._id).then(invalidate)}
                          className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Sub-context Selected City Localities Feed Drawer */}
                <div className="md:col-span-2">
                  {viewCityId ? (
                    <Card className="border border-indigo-100/70 bg-gradient-to-b from-indigo-50/10 via-white to-white shadow-lg rounded-xl overflow-hidden animate-in fade-in slide-in-from-right-3 duration-300">
                      <CardHeader className="border-b border-indigo-50/50 px-5 py-4 bg-indigo-50/20 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-indigo-950 tracking-tight flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-indigo-500" />
                          Localities Inspection View
                        </CardTitle>
                        {localitiesFetching && <Loader2 className="h-3.5 w-3.5 text-indigo-500 animate-spin" />}
                      </CardHeader>
                      <CardContent className="p-5">
                        {cityLocalities.length === 0 ? (
                          <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <MapPin className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">No zones assigned</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 px-4">Locality sectors haven't been mapped to this city branch node yet.</p>
                          </div>
                        ) : (
                          <ul className="space-y-1.5 custom-scrollbar max-h-[380px] overflow-y-auto pr-1">
                            {cityLocalities.map((l) => (
                              <li 
                                key={l._id} 
                                className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 animate-in fade-in duration-200"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="truncate">{l.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-slate-400 min-h-[220px]">
                      <Eye className="h-6 w-6 text-slate-300 mb-2" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Inspection Node Idle</h4>
                      <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                        Select any registered urban city item row component within the directory catalog matrix to deploy the locality tree view.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localities Insertion Tab Section */}
        <TabsContent value="localities" className="outline-none focus:outline-none focus:ring-0 animate-in fade-in-30 slide-in-from-bottom-2 duration-300">
          <Card className="border border-slate-100 bg-white/90 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-6 sm:p-8 bg-gradient-to-b from-slate-50/40 to-transparent">
              <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Navigation className="h-4 w-4 text-indigo-500" />
                Sectors & Localities Ledger Ingest
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-5 md:grid-cols-3 items-end rounded-xl border border-slate-100 bg-slate-50/30 p-5 sm:p-6 max-w-4xl">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent City Mapping</Label>
                  <Select value={localityCityId} onValueChange={setLocalityCityId}>
                    <SelectTrigger className="bg-white"><SelectValue placeholder="Choose target city matrix" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name} <span className="text-[11px] text-slate-400 font-normal">({c.stateId?.name || 'Global'})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Locality Sector Title</Label>
                  <Input 
                    placeholder="e.g. Vaishali Nagar"
                    value={localityName} 
                    onChange={(e) => setLocalityName(e.target.value)} 
                    className="h-11 border-slate-200 bg-white rounded-xl focus:bg-white"
                  />
                </div>
                <Button 
                  onClick={() => localityMutation.mutate({ name: localityName, cityId: localityCityId })}
                  disabled={localityMutation.isPending || !localityName.trim() || !localityCityId}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold h-11 rounded-xl shadow-md shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {localityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                  Add Locality Block
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}