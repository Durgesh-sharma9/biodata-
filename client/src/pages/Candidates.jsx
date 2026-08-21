import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, 
  MapPin, Briefcase, GraduationCap, Calendar, IndianRupee, 
  Users, ShieldAlert, SlidersHorizontal, ArrowUpDown, Loader2, List, Map as MapIcon, AlertCircle,
  ChevronDown, ChevronUp, RotateCcw, Filter
} from 'lucide-react';
import { getCandidates, deleteCandidate, getSettings, getStates, getCities } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { formatCandidateLocation, buildLocationSearchText, calculateDistanceKm } from '@/lib/location';
import { MapView } from '@/components/common/MapView';

const SOURCE_OPTIONS = ['ADMIN', 'SCHOOL_LINK', 'SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'];

export function CandidateList({
  section,
  title,
  description,
  showAddButton = false,
  sourceFilterOptions = SOURCE_OPTIONS,
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    mobile: '',
    position: '',
    qualification: '',
    experience: '',
    state: '',
    stateId: '',
    city: '',
    cityId: '',
    area: '',
    source: '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    nearby: false,
    radiusKm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data: filterCities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities().then((r) => r.data.data),
  });

  const stateOptions = useMemo(() => [
    { value: '', label: 'All States' },
    ...states.map(s => ({ value: s._id, label: s.name }))
  ], [states]);

  const cityOptions = useMemo(() => [
    { value: '', label: 'All Cities' },
    ...filterCities.map(c => ({ value: c._id, label: c.name }))
  ], [filterCities]);

  const locationOptions = useMemo(() => [
    { value: '', label: 'All Areas' },
  ], []);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', section, page, filters],
    queryFn: () =>
      getCandidates({
        section,
        page,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== '' && v !== false)
        ),
      }).then((r) => r.data),
  });

  const filteredCandidates = useMemo(() => {
    if (!data?.data) return [];

    const query = (filters.name || '').trim().toLowerCase();
    const nearbyEnabled = !!filters.nearby;
    const radiusLimit = Number(filters.radiusKm) || 50;

    return data.data.filter((candidate) => {
      const searchText = buildLocationSearchText(candidate);
      const matchesSearch = !query || searchText.includes(query);
      const matchesState = !filters.state || (candidate.state || '').toLowerCase().includes(filters.state.toLowerCase());
      const matchesCity = !filters.city || (candidate.city || '').toLowerCase().includes(filters.city.toLowerCase());
      const matchesArea = !filters.area || (candidate.area || '').toLowerCase().includes(filters.area.toLowerCase());

      let matchesNearby = true;
      if (nearbyEnabled) {
        const distanceKm = candidate.distanceKm ?? calculateDistanceKm(
          candidate.schoolLatitude,
          candidate.schoolLongitude,
          candidate.latitude,
          candidate.longitude
        );
        matchesNearby = distanceKm === null || distanceKm <= radiusLimit;
      }

      return matchesSearch && matchesState && matchesCity && matchesArea && matchesNearby;
    });
  }, [data?.data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteId(null);
    },
  });

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSourceBadge = (source) => {
    const formatStr = (str) => str?.replace(/_/g, ' ') || '';
    switch(source) {
      case 'ADMIN':
        return <Badge className="border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] font-bold px-2.5 py-0.5 rounded-xl variant-outline shadow-none">{formatStr(source)}</Badge>;
      case 'SCHOOL_LINK':
        return <Badge className="border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] font-bold px-2.5 py-0.5 rounded-xl variant-outline shadow-none">{formatStr(source)}</Badge>;
      case 'SELF_APPLICANT':
        return <Badge className="border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] font-bold px-2.5 py-0.5 rounded-xl variant-outline shadow-none">{formatStr(source)}</Badge>;
      case 'SUPER_ADMIN_IMPORT':
        return <Badge className="border-[#9E58FF]/30 bg-[#9E58FF]/5 text-[#9E58FF] font-bold px-2.5 py-0.5 rounded-xl variant-outline shadow-none">{formatStr(source)}</Badge>;
      default:
        return <Badge className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-500 font-bold px-2.5 py-0.5 rounded-xl variant-outline shadow-none">Talent Pool</Badge>;
    }
  };

  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (filters.mobile) count++;
    if (filters.experience) count++;
    if (filters.stateId || filters.state) count++;
    if (filters.cityId || filters.city) count++;
    if (filters.area) count++;
    if (filters.expectedSalaryMin || filters.expectedSalaryMax) count++;
    if (filters.nearby) count++;
    return count;
  }, [filters]);

  const hasAnyActiveFilter = useMemo(() => {
    return !!(
      filters.name ||
      filters.position ||
      filters.qualification ||
      activeAdvancedCount > 0
    );
  }, [filters, activeAdvancedCount]);

  const clearAllFilters = () => {
    setPage(1);
    setFilters({
      name: '',
      mobile: '',
      position: '',
      qualification: '',
      experience: '',
      state: '',
      stateId: '',
      city: '',
      cityId: '',
      area: '',
      source: '',
      expectedSalaryMin: '',
      expectedSalaryMax: '',
      nearby: false,
      radiusKm: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      {/* Minimalist Page Header Panel Layout */}
      <PageHeader
        title={title}
        description={description}
        action={
          showAddButton ? (
            <Button asChild className="bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shrink-0 shadow-md shadow-[#A05AFF]/20 h-9 text-xs px-4">
              <Link to="/candidates/new">
                <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[3]" />
                Add Candidate
              </Link>
            </Button>
          ) : null
        }
      />

      {/* COMPACT & SLEEK FILTER CONTROL CENTER */}
      <Card>
        <CardContent className="p-3.5 space-y-3">
          
          {/* Primary Quick Search Bar Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by candidate name, location..."
                className="pl-9 h-9 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
              />
            </div>

            {/* Position Select */}
            <div className="w-[170px] shrink-0">
              <Select value={filters.position || 'all'} onValueChange={(v) => updateFilter('position', v === 'all' ? '' : v)}>
                <SelectTrigger className="h-9 border-slate-200 rounded-lg focus:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-slate-800 max-h-64">
                  <SelectItem value="all" className="text-xs font-medium text-slate-400">All Positions</SelectItem>
                  {settings?.positions?.map((p) => (
                    <SelectItem key={p} value={p} className="text-xs font-medium rounded-md">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Qualification Select */}
            <div className="w-[170px] shrink-0">
              <Select
                value={filters.qualification || 'all'}
                onValueChange={(v) => updateFilter('qualification', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="h-9 border-slate-200 rounded-lg focus:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
                  <SelectValue placeholder="All Qualifications" />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-slate-800 max-h-64">
                  <SelectItem value="all" className="text-xs font-medium text-slate-400">All Qualifications</SelectItem>
                  {settings?.qualifications?.map((q) => (
                    <SelectItem key={q} value={q} className="text-xs font-medium rounded-md">
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters Toggle Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-9 px-3 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-700 transition-all ${showAdvancedFilters ? 'bg-purple-50 text-[#A05AFF] border-[#A05AFF]/30' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-[#A05AFF]" />
              Filters
              {activeAdvancedCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#A05AFF] text-white text-[10px] font-bold">
                  {activeAdvancedCount}
                </span>
              )}
              {showAdvancedFilters ? (
                <ChevronUp className="h-3.5 w-3.5 ml-1.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 ml-1.5 text-slate-400" />
              )}
            </Button>

            {/* Reset Filters Button */}
            {hasAnyActiveFilter && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 rounded-lg"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Collapsible Advanced Filters Drawer */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in-50 duration-200">
              
              {section !== 'talent_pool' && (
                <div className="relative">
                  <Input
                    placeholder="Search by mobile..."
                    className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                    value={filters.mobile}
                    onChange={(e) => updateFilter('mobile', e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <Input
                  type="number"
                  placeholder="Experience (years)"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.experience}
                  onChange={(e) => updateFilter('experience', e.target.value)}
                />
              </div>

              <SearchableSelect
                options={stateOptions}
                value={filters.stateId || ''}
                onChange={(v) => {
                  const state = states.find(s => s._id === v);
                  setFilters(prev => ({ ...prev, stateId: v, state: state?.name || '' }));
                  setPage(1);
                }}
                placeholder="All States"
                limit={Infinity}
              />

              <SearchableSelect
                options={cityOptions}
                value={filters.cityId || ''}
                onChange={(v) => {
                  const city = filterCities.find(c => c._id === v);
                  setFilters(prev => ({ ...prev, cityId: v, city: city?.name || '' }));
                  setPage(1);
                }}
                placeholder="All Cities"
                limit={100}
              />

              <div className="relative">
                <Input
                  placeholder="All Areas"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.area}
                  onChange={(e) => updateFilter('area', e.target.value)}
                />
              </div>

              <div className="relative">
                <Input
                  type="number"
                  placeholder="Min Monthly Salary"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.expectedSalaryMin}
                  onChange={(e) => updateFilter('expectedSalaryMin', e.target.value)}
                />
              </div>

              <div className="relative">
                <Input
                  type="number"
                  placeholder="Max Monthly Salary"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.expectedSalaryMax}
                  onChange={(e) => updateFilter('expectedSalaryMax', e.target.value)}
                />
              </div>

              {section !== 'talent_pool' && (
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 rounded-lg border px-3 h-9 text-xs font-semibold flex-1 ${!data?.schoolLocation ? 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed' : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    <input
                      type="checkbox"
                      checked={!!filters.nearby}
                      onChange={(e) => updateFilter('nearby', e.target.checked)}
                      disabled={!data?.schoolLocation}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#A05AFF] disabled:opacity-50"
                    />
                    Nearby only
                  </label>

                  <Input
                    type="number"
                    placeholder="Radius (km)"
                    className={`h-9 w-24 border-slate-200 rounded-lg focus-visible:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium ${!data?.schoolLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={filters.radiusKm}
                    onChange={(e) => updateFilter('radiusKm', e.target.value)}
                    disabled={!filters.nearby || !data?.schoolLocation}
                  />
                </div>
              )}

            </div>
          )}

        </CardContent>
      </Card>

      {/* School Location Warning */}
      {section !== 'talent_pool' && !data?.schoolLocation && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                School location not configured
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Complete your School Location in <Link to="/school-profile" className="font-bold underline hover:text-amber-900 dark:hover:text-amber-100">School Profile</Link> to enable Nearby Search and Map View.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Listing View Table Interface */}
      <Card>
        <CardContent className="p-0">
          {section !== 'talent_pool' && (
            <div className="flex items-center justify-end gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <Button
                type="button"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                className={viewMode === 'list' ? 'bg-[#A05AFF] text-white' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}
                onClick={() => setViewMode('list')}
              >
                <List className="mr-2 h-4 w-4" />
                List View
              </Button>
              <Button
                type="button"
                variant={viewMode === 'map' ? 'default' : 'outline'}
                className={viewMode === 'map' ? 'bg-[#A05AFF] text-white' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}
                onClick={() => setViewMode('map')}
                disabled={!data?.schoolLocation}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Map View
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-5 w-5 text-[#A05AFF] animate-spin" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
                Fetching candidate universe...
              </p>
            </div>
          ) : (
            <div className="w-full">
              {section !== 'talent_pool' && viewMode === 'map' ? (
                <div className="space-y-4 p-4">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Nearby talent map</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">School marker, candidate pins, distance, position, and area are surfaced here.</p>
                    </div>
                    <div className="p-4">
                      <MapView 
                        candidates={filteredCandidates} 
                        schoolLocation={data?.schoolLocation}
                        workingRadius={filters.nearby ? Number(filters.radiusKm) || 50 : undefined}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredCandidates.map((c) => (
                      <div key={c._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.fullName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{c.position}</p>
                          </div>
                          {Number.isFinite(c.distanceKm) ? (
                            <Badge className="rounded-full border-[#A05AFF]/20 bg-[#A05AFF]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#A05AFF]">
                              {c.distanceKm.toFixed(1)} km
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatCandidateLocation(c)}</p>
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{c.area || 'Area not provided'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {/* Mobile Card Layout - Below md */}
                  <div className="md:hidden space-y-4">
                    {filteredCandidates.length === 0 ? (
                      <div className="py-20 text-center">
                        <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                            <Users className="h-5 w-5" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No candidates detected</h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                            We couldn't find matches for your active parameters. Try expanding your filters or add a new record.
                          </p>
                        </div>
                      </div>
                    ) : (
                      filteredCandidates.map((c) => (
                        <Card key={c._id} className="border border-slate-200/60 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Photo */}
                              <div className="shrink-0">
                                {c.profilePhoto ? (
                                  <div className="h-12 w-12 rounded-full p-0.5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <img
                                      src={c.profilePhoto}
                                      alt={c.fullName}
                                      className="h-full w-full rounded-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center border border-slate-200/40">
                                    {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </div>
                              
                              {/* Name and Position */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{c.fullName}</span>
                                  {c.isLocked && (
                                    <Badge className="text-[10px] uppercase font-bold tracking-wider border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-md px-1.5 py-0 shadow-none variant-outline shrink-0">
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 font-semibold text-xs truncate">{c.position}</p>
                                <p className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] truncate mt-1">
                                  {formatCandidateLocation(c)}{Number.isFinite(c.distanceKm) ? ` • ${c.distanceKm.toFixed(1)} km` : ''}
                                </p>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <Button variant="view" size="icon" asChild className="h-8 w-8">
                                  <Link to={`/candidates/${c._id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                
                                {c.canEdit && (
                                  <>
                                    <Button variant="edit" size="icon" asChild className="h-8 w-8">
                                      <Link to={`/candidates/${c._id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    
                                    <Button variant="delete" size="icon" onClick={() => setDeleteId(c._id)} className="h-8 w-8">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Desktop Table Layout - md and above */}
                  <div className="hidden md:block w-full min-w-0 overflow-x-auto">
                    <Table>
                      <TableHeader className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="w-[50px] text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pl-4 py-3">Photo</TableHead>
                          
                          <TableHead 
                            className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-3 px-3" 
                            onClick={() => handleSort('fullName')}
                          >
                            <div className="flex items-center gap-1">
                              Name
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-3 px-3" 
                            onClick={() => handleSort('position')}
                          >
                            <div className="flex items-center gap-1">
                              Position
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            </div>
                          </TableHead>
                          
                          <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider py-3 px-3 hidden md:table-cell">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</div>
                          </TableHead>

                          <TableHead className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider py-3 px-3 hidden lg:table-cell'}>
                            <div className="flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Qualification</div>
                          </TableHead>
                          
                          <TableHead 
                            className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-3 px-3 hidden md:table-cell'}
                            onClick={() => handleSort('experienceYears')}
                          >
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> Experience
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            </div>
                          </TableHead>
                          
                          <TableHead
                            className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-3 px-3 hidden md:table-cell'}
                            onClick={() => handleSort('expectedSalary')}
                          >
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> Salary
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-3 px-3 hidden lg:table-cell'} 
                            onClick={() => handleSort('createdAt')}
                          >
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Date
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            </div>
                          </TableHead>
                          
                          <TableHead className="text-right text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pr-4 py-3 w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      
                      <TableBody>
                        {filteredCandidates.length === 0 ? (
                          <TableRow className="hover:bg-transparent border-none">
                            <TableCell colSpan={9} className="py-16 text-center">
                              <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                                  <Users className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No candidates detected</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                                  We couldn't find matches for your active parameters. Try expanding your filters or add a new record.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCandidates.map((c) => (
                            <TableRow 
                              key={c._id} 
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/60 last:border-none transition-all group"
                            >
                              <TableCell className="pl-4 py-2.5">
                                {c.profilePhoto ? (
                                  <div className="h-9 w-9 rounded-full p-0.5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <img
                                      src={c.profilePhoto}
                                      alt={c.fullName}
                                      className="h-full w-full rounded-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center border border-slate-200/40">
                                    {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </TableCell>
                              
                              <TableCell className="font-bold text-slate-800 dark:text-slate-200 text-xs py-2.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="group-hover:text-[#A05AFF] transition-colors truncate">{c.fullName}</span>
                                  {c.isLocked && (
                                    <Badge className="text-[9px] uppercase font-bold tracking-wider border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-md px-1 py-0 shadow-none variant-outline shrink-0">
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              
                              <TableCell className="text-slate-600 dark:text-slate-300 font-semibold text-xs py-2.5 px-3 truncate">{c.position}</TableCell>
                              
                              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs py-2.5 px-3 truncate hidden md:table-cell max-w-[150px]">
                                {formatCandidateLocation(c)}{Number.isFinite(c.distanceKm) ? ` • ${c.distanceKm.toFixed(1)} km` : ''}
                              </TableCell>

                              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs py-2.5 px-3 truncate hidden lg:table-cell max-w-[130px]">
                                {c.qualifications?.join(', ') || '—'}
                              </TableCell>
                              
                              <TableCell className="py-2.5 px-3 hidden md:table-cell">
                                <Badge className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] font-bold px-2 py-0.5 variant-outline shadow-none">
                                  {c.experienceYears} yrs
                                </Badge>
                              </TableCell>
                              
                              <TableCell className="font-bold text-slate-800 dark:text-slate-200 text-xs py-2.5 px-3 hidden md:table-cell">
                                {c.expectedSalary ? (
                                  <Badge className="border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] text-[11px] font-bold px-2 py-0.5 rounded-lg variant-outline shadow-none">
                                    ₹{c.expectedSalary.toLocaleString('en-IN')}
                                  </Badge>
                                ) : (
                                  <span className="text-slate-400 dark:text-slate-600 font-normal">—</span>
                                )}
                              </TableCell>
                              
                              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs py-2.5 px-3 hidden lg:table-cell">
                                {formatDate(c.createdAt)}
                              </TableCell>
                              
                              <TableCell className="text-right pr-4 py-2.5">
                                <div className="flex justify-end items-center gap-1">
                                  <Button variant="view" size="icon" asChild className="h-7 w-7">
                                    <Link to={`/candidates/${c._id}`}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Link>
                                  </Button>
                                  
                                  {c.canEdit && (
                                    <>
                                      <Button variant="edit" size="icon" asChild className="h-8 w-8">
                                        <Link to={`/candidates/${c._id}/edit`}>
                                          <Pencil className="h-4 w-4" />
                                        </Link>
                                      </Button>
                                      
                                      <Button variant="delete" size="icon" onClick={() => setDeleteId(c._id)} className="h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )} {/* <-- This closing brace and parenthesis was missing in your original code */}

              {/* Redesigned Premium Pagination Controls */}
              {data?.pagination && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs md:text-sm font-semibold text-slate-400 dark:text-slate-500 tracking-wide text-center sm:text-left">
                    Displaying <span className="text-slate-700 dark:text-slate-300 font-bold">Page {data.pagination.page}</span> of <span className="text-slate-700 dark:text-slate-300 font-bold">{data.pagination.totalPages}</span> <span className="text-slate-400 dark:text-slate-600">({data.pagination.total} entries total)</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page <= 1} 
                      onClick={() => setPage((p) => p - 1)}
                      className="h-9 rounded-xl border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 font-bold transition-all disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="h-9 rounded-xl border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 font-bold transition-all disabled:opacity-40"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Soft Deletion Modal Frame */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md rounded-xl border-none bg-white p-6 dark:bg-slate-900 shadow-sm">
          <DialogHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 text-slate-400">
              <ShieldAlert className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                This action will safely soft-delete this candidate from your secure school ecosystem database workspace.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="rounded-xl h-11 font-medium border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 w-full sm:w-auto"
            >
              Keep Candidate
            </Button>
            <Button
              onClick={() => deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-xl h-11 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto shadow-md shadow-rose-500/20"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Yes, Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyCandidates() {
  return (
    <CandidateList
      section="my_candidates"
      title="My Candidates"
      description="Candidates added by your school (ADMIN) and via your application link (SCHOOL_LINK). Full access, no credit required."
      showAddButton
    />
  );
}

export function TalentPool() {
  return (
    <CandidateList
      section="talent_pool"
      title="Talent Pool"
      description="Browse platform candidates and profiles from other schools. Unlock profiles using credits."
      sourceFilterOptions={[]}
    />
  );
}