import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Trash2, MapPin, Plus, Globe, Building2, Download, 
  Loader2, Sparkles, CheckCircle2, AlertCircle, Search, Compass
} from 'lucide-react';
import {
  getStates,
  getCities,
  createState,
  createCity,
  deleteState,
  deleteCity,
  importIndiaLocations,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogBody, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function Locations() {
  const queryClient = useQueryClient();
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityStateId, setCityStateId] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importBanner, setImportBanner] = useState(null);
  const [citySearch, setCitySearch] = useState('');

  const { data: states = [], isLoading: statesLoading } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities-all'],
    queryFn: () => getCities().then((r) => r.data.data),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['states'] });
    queryClient.invalidateQueries({ queryKey: ['cities-all'] });
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

  const importMutation = useMutation({
    mutationFn: importIndiaLocations,
    onSuccess: (data) => {
      invalidate();
      setImportDialogOpen(false);
      setImportBanner({
        type: 'success',
        message: `Import successful! States added: ${data.data?.data?.statesImported || 0}, Cities added: ${data.data?.data?.citiesImported || 0}`,
      });
      setTimeout(() => setImportBanner(null), 6000);
    },
    onError: (error) => {
      setImportBanner({
        type: 'error',
        message: `Import failed: ${error.response?.data?.message || error.message}`,
      });
    },
  });

  const filteredCities = cities.filter((c) => {
    if (!citySearch) return true;
    const nameMatch = c.name?.toLowerCase().includes(citySearch.toLowerCase());
    const stateMatch = c.stateId?.name?.toLowerCase().includes(citySearch.toLowerCase());
    return nameMatch || stateMatch;
  });

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-[#FF007A] rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Geographic Taxonomy: States & Cities
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-50 text-[#FF007A] dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/60 shrink-0">
                {states.length} States, {cities.length} Cities
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Maintain regional territories for candidate location targeting and school matching
            </p>
          </div>
        </div>
        
        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setImportDialogOpen(true)}
            className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Import India Data</span>
          </Button>
        </div>
      </div>

      {/* ─── BANNER NOTIFICATION ─── */}
      {importBanner && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs font-semibold animate-in fade-in duration-200',
            importBanner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
          )}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{importBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportBanner(null)}
            className="font-bold opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── 2. MINI STATS ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Configured States
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 dark:text-white mt-1">
              {states.length}
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Active state entities</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#EFF6FF] via-white to-cyan-50/50 dark:bg-slate-900 border border-cyan-200/80 dark:border-cyan-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              Configured Cities
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {cities.length}
            </h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">Mapped urban locations</p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-100/80 dark:bg-cyan-950/60 text-[#00D2FF] dark:text-cyan-300">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 3. TABS: STATES VS CITIES ─── */}
      <Tabs defaultValue="states" className="w-full space-y-4">
        <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <TabsTrigger 
            value="states" 
            className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-[#8A3BD4] cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5" />
            States ({states.length})
          </TabsTrigger>
          <TabsTrigger 
            value="cities" 
            className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-[#8A3BD4] cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5" />
            Cities ({cities.length})
          </TabsTrigger>
        </TabsList>

        {/* ─── STATES TAB ─── */}
        <TabsContent value="states" className="space-y-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#8A3BD4]" />
                <span>Regional States Directory</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-5">
              {/* Add State Input */}
              <div className="flex gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Compass className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Enter state name (e.g. Rajasthan, Delhi)" 
                    value={stateName} 
                    onChange={(e) => setStateName(e.target.value)} 
                    className="pl-10 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>
                <Button 
                  onClick={() => stateMutation.mutate({ name: stateName })}
                  disabled={stateMutation.isPending || !stateName.trim()}
                  className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] text-white font-bold h-10 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {stateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add State
                </Button>
              </div>

              {/* State Badges Grid */}
              <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
                <Label className="mb-3 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  All Configured States
                </Label>
                {statesLoading ? (
                  <div className="flex items-center gap-2 py-4 text-slate-400 text-xs font-semibold animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-[#8A3BD4]" /> Loading states...
                  </div>
                ) : states.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-400 py-2">No regional states configured yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {states.map((s) => (
                      <Badge 
                        key={s._id} 
                        variant="outline" 
                        className="pl-3 pr-1.5 py-1 border-purple-200/80 bg-purple-50/80 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 shadow-none rounded-xl font-bold text-xs flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8A3BD4]" />
                        <span>{s.name}</span>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete state "${s.name}"?`)) {
                              deleteState(s._id).then(invalidate);
                            }
                          }} 
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-all cursor-pointer"
                          title={`Remove ${s.name}`}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CITIES TAB ─── */}
        <TabsContent value="cities" className="space-y-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#8A3BD4]" />
                <span>Urban Cities Mapping</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-5">
              {/* Form Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-end rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Parent State *</Label>
                  <Select value={cityStateId} onValueChange={setCityStateId}>
                    <SelectTrigger className="h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold">
                      <SelectValue placeholder="Choose State" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 rounded-xl">
                      {states.map((s) => <SelectItem key={s._id} value={s._id} className="text-xs font-semibold">{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">City Name *</Label>
                  <Input 
                    placeholder="e.g. Jaipur, Kota, Jodhpur"
                    value={cityName} 
                    onChange={(e) => setCityName(e.target.value)} 
                    className="h-10 bg-white dark:bg-slate-800 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>

                <Button 
                  onClick={() => cityMutation.mutate({ name: cityName, stateId: cityStateId })}
                  disabled={cityMutation.isPending || !cityName.trim() || !cityStateId}
                  className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] text-white font-bold h-10 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {cityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add City
                </Button>
              </div>

              {/* Search Cities */}
              <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Filter cities or states..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="pl-10 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              {/* Cities Grid List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
                {citiesLoading ? (
                  <div className="flex items-center gap-2 py-6 text-slate-400 text-xs font-semibold animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-[#8A3BD4]" /> Loading cities...
                  </div>
                ) : filteredCities.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-400 py-4 text-center">No cities found matching query.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {filteredCities.map((c) => (
                      <div 
                        key={c._id} 
                        className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-3 py-2 text-xs font-bold hover:border-purple-300 transition-all shadow-2xs group"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#8A3BD4] shrink-0" />
                          <span className="truncate text-slate-900 dark:text-white">{c.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md shrink-0">
                            {c.stateId?.name || 'India'}
                          </span>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm(`Delete city "${c.name}"?`)) {
                              deleteCity(c._id).then(invalidate);
                            }
                          }}
                          className="h-6 w-6 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer ml-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── IMPORT CONFIRMATION DIALOG ─── */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-lg">
                <Download className="h-4 w-4" />
              </div>
              <span>Import Indian States & Major Cities</span>
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              This will populate all standard Indian states and major educational cities automatically. Existing records will not be duplicated.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
              className="rounded-xl h-10 px-4 font-bold text-xs border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending}
              className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold rounded-xl h-10 px-5 text-xs shadow-sm cursor-pointer"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Importing...
                </>
              ) : (
                'Confirm & Import'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}