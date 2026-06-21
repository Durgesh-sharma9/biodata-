import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, MapPin, Plus, Eye, Navigation, Globe, Building2, Layers, Compass, Loader2, Download } from 'lucide-react';
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
  importIndiaLocations,
} from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function Locations() {
  const queryClient = useQueryClient();
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityStateId, setCityStateId] = useState('');
  const [localityName, setLocalityName] = useState('');
  const [localityCityId, setLocalityCityId] = useState('');
  const [viewCityId, setViewCityId] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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

  const importMutation = useMutation({
    mutationFn: importIndiaLocations,
    onSuccess: (data) => {
      invalidate();
      setImportDialogOpen(false);
      // Show success message with counts
      alert(`Import successful!\nStates imported: ${data.data.data.statesImported}\nCities imported: ${data.data.data.citiesImported}`);
    },
    onError: (error) => {
      alert(`Import failed: ${error.response?.data?.message || error.message}`);
    },
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen animate-in fade-in duration-500">
      {/* Page Header Panel */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <PageHeader 
          title="Location Management" 
          description="Configure and audit the structural region parameters spanning State → City → Locality networks." 
        />
      </div>

      <Tabs defaultValue="states" className="w-full space-y-6">
        {/* Soft Translucent Highlight Tabs Wrapper */}
        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <TabsTrigger 
            value="states" 
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 active:scale-[0.97]"
          >
            <Globe className="h-4 w-4" />
            States ({states.length})
          </TabsTrigger>
          <TabsTrigger 
            value="cities" 
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 active:scale-[0.97]"
          >
            <Building2 className="h-4 w-4" />
            Cities ({cities.length})
          </TabsTrigger>
          <TabsTrigger 
            value="localities" 
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 active:scale-[0.97]"
          >
            <Navigation className="h-4 w-4" />
            Localities Add
          </TabsTrigger>
        </TabsList>

        {/* States Tab Section */}
        <TabsContent value="states" className="outline-none focus:outline-none focus:ring-0 animate-in fade-in-30 slide-in-from-bottom-2 duration-300">
          <Card className="table">
            <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  Regional States Network
                </CardTitle>
                <Button
                  onClick={() => setImportDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-9 px-4 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Import India States & Cities
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              <div className="flex gap-3 max-w-xl group">
                <div className="relative flex-1">
                  <Compass className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <Input 
                    placeholder="Enter new state identifier (e.g. Rajasthan)" 
                    value={stateName} 
                    onChange={(e) => setStateName(e.target.value)} 
                    className="pl-10 h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <Button 
                  onClick={() => stateMutation.mutate({ name: stateName })}
                  disabled={stateMutation.isPending || !stateName.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 px-5 rounded-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  {stateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                  Add State
                </Button>
              </div>

              <div className="rounded-xl p-5 bg-slate-50/70 dark:bg-slate-950/40">
                <Label className="mb-3 inline-block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Registered States Directory
                </Label>
                {statesLoading ? (
                  <div className="flex items-center gap-2 py-4 text-slate-400 dark:text-slate-500 font-medium text-sm animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> Loading states catalog...
                  </div>
                ) : states.length === 0 ? (
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500 italic py-2">No regional states configured in platform ledger yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {states.map((s) => (
                      <Badge 
                        key={s._id} 
                        variant="outline" 
                        className="gap-2.5 pl-3.5 pr-2 py-1.5 border-purple-200/60 bg-purple-50/80 text-purple-700 shadow-none rounded-lg font-semibold text-xs transition-all duration-200 animate-in fade-in zoom-in-95"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {s.name}
                        <button 
                          onClick={() => deleteState(s._id).then(invalidate)} 
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-all ml-1"
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
          <Card className="table">
            <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800">
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                Urban Cities Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              {/* Form Input Structural Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-end rounded-xl p-5 bg-slate-50/70 dark:bg-slate-950/40 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Parent State Attachment</Label>
                  <Select value={cityStateId} onValueChange={setCityStateId}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                      <SelectValue placeholder="Choose state map context" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 rounded-xl">
                      {states.map((s) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">City Nomenclature Name</Label>
                  <Input 
                    placeholder="e.g. Jaipur"
                    value={cityName} 
                    onChange={(e) => setCityName(e.target.value)} 
                    className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <Button 
                  onClick={() => cityMutation.mutate({ name: cityName, stateId: cityStateId })}
                  disabled={cityMutation.isPending || !cityName.trim() || !cityStateId}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {cityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                  Add City Node
                </Button>
              </div>

              {/* Layout Content Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* Cities Column */}
                <div className="lg:col-span-3 space-y-2 max-h-[500px] overflow-y-auto pr-2 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/10">
                  <Label className="mb-2 inline-block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">Registered Urban Hubs</Label>
                  {citiesLoading ? (
                    <div className="flex items-center gap-2 py-4 text-slate-400 dark:text-slate-500 font-medium text-sm pl-1 animate-pulse">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> Fetching cities register...
                    </div>
                  ) : cities.length === 0 ? (
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500 italic py-2 pl-1">No cities mapped to state parameters yet.</p>
                  ) : (
                    cities.map((c) => (
                      <div 
                        key={c._id} 
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                          viewCityId === c._id 
                            ? "border-purple-200/60 bg-purple-50/80 text-purple-700" 
                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-700/40"
                        )}
                      >
                        <button 
                          className="text-left flex-1 font-semibold flex items-center gap-2 truncate" 
                          onClick={() => setViewCityId(c._id)}
                        >
                          <Building2 className={cn("h-3.5 w-3.5 text-slate-400", viewCityId === c._id && "text-purple-600")} />
                          <span>{c.name}</span>
                          <span className={cn(
                            "text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md", 
                            viewCityId === c._id 
                              ? "border-purple-200/60 bg-purple-50/80 text-purple-700" 
                              : "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                          )}>
                            {c.stateId?.name || 'Global'}
                          </span>
                        </button>
                        <Button 
                          size="sm" 
                          variant="delete"
                          onClick={() => deleteCity(c._id).then(invalidate)}
                          className="h-8 w-8 ml-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Localities Drawer View */}
                <div className="lg:col-span-2">
                  {viewCityId ? (
                    <Card className="rounded-xl border border-purple-200/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-3 duration-300">
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-row items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-purple-600" />
                          Localities Inspection View
                        </h4>
                        {localitiesFetching && <Loader2 className="h-3.5 w-3.5 text-purple-600 animate-spin" />}
                      </div>
                      <CardContent className="p-5">
                        {cityLocalities.length === 0 ? (
                          <div className="text-center py-8 bg-slate-50/30 dark:bg-slate-950/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                            <MapPin className="h-6 w-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">No zones assigned</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 px-4">Locality sectors haven't been mapped to this city branch node yet.</p>
                          </div>
                        ) : (
                          <ul className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                            {cityLocalities.map((l) => (
                              <li 
                                key={l._id} 
                                className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-xl px-3 py-2 animate-in fade-in duration-200"
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
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-950/10 text-slate-400 min-h-[220px]">
                      <Eye className="h-6 w-6 text-slate-300 dark:text-slate-700 mb-2" />
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Inspection Node Idle</h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1">
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
          <Card className="table">
            <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800">
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-purple-600" />
                Sectors & Localities Ledger Ingest
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 items-end rounded-xl p-5 bg-slate-50/70 dark:bg-slate-950/40 gap-6 max-w-4xl">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Parent City Mapping</Label>
                  <Select value={localityCityId} onValueChange={setLocalityCityId}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                      <SelectValue placeholder="Choose target city matrix" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 rounded-xl">
                      {cities.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name} <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">({c.stateId?.name || 'Global'})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Locality Sector Title</Label>
                  <Input 
                    placeholder="e.g. Vaishali Nagar"
                    value={localityName} 
                    onChange={(e) => setLocalityName(e.target.value)} 
                    className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <Button 
                  onClick={() => localityMutation.mutate({ name: localityName, cityId: localityCityId })}
                  disabled={localityMutation.isPending || !localityName.trim() || !localityCityId}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {localityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 stroke-[3]" />}
                  Add Locality Block
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import India Locations Confirmation Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md rounded-xl border border-slate-200/60 bg-white p-6 dark:bg-slate-900 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-600" />
              Import India States & Cities
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Import all Indian States and Cities? This action only imports missing records and will not create duplicates.
            </p>
          </DialogBody>
          <DialogFooter className="mt-6 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
              className="rounded-xl h-11 font-medium transition-all border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-11 px-5 transition-all duration-200 active:scale-95"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                'Import Now'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}