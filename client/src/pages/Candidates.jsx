import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, 
  MapPin, Briefcase, GraduationCap, Calendar, IndianRupee, 
  Users, ShieldAlert, SlidersHorizontal, ArrowUpDown, Loader2, List, Map as MapIcon, AlertCircle,
  ChevronDown, ChevronUp, RotateCcw, Filter, Phone, MessageSquare, Mail, Lock, FileText
} from 'lucide-react';
import { getCandidates, deleteCandidate, getSettings, getStates, getCities } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { CandidateDocumentsModal } from '@/components/common/CandidateDocumentsModal';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [docsModalCandidate, setDocsModalCandidate] = useState(null);
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    mobile: searchParams.get('mobile') || '',
    position: searchParams.get('position') || '',
    status: searchParams.get('status') || '',
    qualification: searchParams.get('qualification') || '',
    experience: searchParams.get('experience') || '',
    state: '',
    stateId: '',
    city: '',
    cityId: '',
    area: '',
    source: searchParams.get('source') || '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    nearby: false,
    radiusKm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Sync URL search params with filter state
  useEffect(() => {
    const position = searchParams.get('position');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const name = searchParams.get('name');

    if (position !== null || status !== null || source !== null || name !== null) {
      setFilters((prev) => ({
        ...prev,
        position: position ?? prev.position,
        status: status ?? prev.status,
        source: source ?? prev.source,
        name: name ?? prev.name,
      }));
      setPage(1);
    }
  }, [searchParams]);
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
    queryKey: ['cities', filters.stateId],
    queryFn: () => getCities(filters.stateId || undefined).then((r) => r.data.data),
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

    const nearbyEnabled = !!filters.nearby;
    if (!nearbyEnabled) {
      return data.data;
    }

    const radiusLimit = Number(filters.radiusKm) || 50;
    return data.data.filter((candidate) => {
      const distanceKm = candidate.distanceKm ?? calculateDistanceKm(
        candidate.schoolLatitude,
        candidate.schoolLongitude,
        candidate.latitude,
        candidate.longitude
      );
      return distanceKm === null || distanceKm <= radiusLimit;
    });
  }, [data?.data, filters.nearby, filters.radiusKm]);

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

  const SOURCE_LABELS = {
    ADMIN: { label: 'Walk-in', color: 'border-purple-200/60 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/50' },
    SCHOOL_LINK: { label: 'QR Scan', color: 'border-cyan-200/80 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60' },
    SELF_APPLICANT: { label: 'Self Applied', color: 'border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-teal-700 dark:text-teal-400' },
    SUPER_ADMIN_IMPORT: { label: 'Imported', color: 'border-slate-200/60 bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300' },
  };

  const getSourceBadge = (source) => {
    const info = SOURCE_LABELS[source];
    if (!info) return null;
    return (
      <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border ${info.color} uppercase tracking-wide shrink-0`}>
        {info.label}
      </span>
    );
  };

  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.mobile) count++;
    if (filters.experience) count++;
    if (filters.stateId || filters.state) count++;
    if (filters.cityId || filters.city) count++;
    if (filters.area) count++;
    if (filters.expectedSalaryMin || filters.expectedSalaryMax) count++;
    if (filters.nearby) count++;
    if (filters.source && filters.source !== 'all') count++;
    if (isMobile) {
      if (filters.position && filters.position !== 'all') count++;
      if (filters.qualification && filters.qualification !== 'all') count++;
    }
    return count;
  }, [filters, isMobile]);

  const hasAnyActiveFilter = useMemo(() => {
    return !!(
      filters.name ||
      filters.position ||
      filters.qualification ||
      activeAdvancedCount > 0
    );
  }, [filters, activeAdvancedCount]);

  const clearAllFilters = () => {
    setSearchParams({});
    setPage(1);
    setFilters({
      name: '',
      mobile: '',
      position: '',
      status: '',
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
            <Button asChild className="bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] hover:opacity-95 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shrink-0 shadow-md shadow-purple-500/20 h-9 text-xs px-4">
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
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by candidate name, location..."
                className="pl-9 h-9 border-slate-200 rounded-xl focus-visible:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
              />
            </div>

            {/* Quick Selects - Desktop Only (hidden on mobile, inside filters on mobile) */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-[155px]">
                <Select value={filters.position || 'all'} onValueChange={(v) => updateFilter('position', v === 'all' ? '' : v)}>
                  <SelectTrigger className="h-9 border-slate-200 rounded-xl focus:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl dark:bg-slate-800 max-h-64">
                    <SelectItem value="all" className="text-xs font-medium text-slate-400">All Positions</SelectItem>
                    {settings?.positions?.map((p) => (
                      <SelectItem key={p} value={p} className="text-xs font-medium rounded-md">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[155px]">
                <Select
                  value={filters.qualification || 'all'}
                  onValueChange={(v) => updateFilter('qualification', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-9 border-slate-200 rounded-xl focus:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
                    <SelectValue placeholder="All Qualifications" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl dark:bg-slate-800 max-h-64">
                    <SelectItem value="all" className="text-xs font-medium text-slate-400">All Qualifications</SelectItem>
                    {settings?.qualifications?.map((q) => (
                      <SelectItem key={q} value={q} className="text-xs font-medium rounded-md">
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters Toggle Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`h-9 px-3 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700 transition-all ${showAdvancedFilters ? 'bg-teal-50 text-[#0F766E] border-[#0F766E]/40' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-[#0F766E]" />
                Filters
                {activeAdvancedCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#0F766E] text-white text-[10px] font-bold">
                    {activeAdvancedCount}
                  </span>
                )}
                {showAdvancedFilters ? (
                  <ChevronUp className="h-3.5 w-3.5 ml-1.5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 ml-1.5 text-slate-400" />
                )}
              </Button>

              {/* Reset Filters Button (Desktop) */}
              {hasAnyActiveFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="hidden sm:inline-flex h-9 px-2.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 rounded-xl"
                  title="Clear all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>

          {/* Collapsible Advanced Filters Drawer - 2 Columns on Mobile, 4 Columns on Desktop */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-2.5 animate-in fade-in-50 duration-200">
              
              {/* Position Filter - Mobile Only (inside drawer) */}
              <div className="sm:hidden relative">
                <Select value={filters.position || 'all'} onValueChange={(v) => updateFilter('position', v === 'all' ? '' : v)}>
                  <SelectTrigger className="h-9 border-slate-200 rounded-lg focus:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
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

              {/* Qualification Filter - Mobile Only (inside drawer) */}
              <div className="sm:hidden relative">
                <Select
                  value={filters.qualification || 'all'}
                  onValueChange={(v) => updateFilter('qualification', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-9 border-slate-200 rounded-lg focus:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
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

              {/* Pipeline Status Filter */}
              <div className="relative">
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(v) => updateFilter('status', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="h-9 border-slate-200 rounded-lg focus:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg dark:bg-slate-800 max-h-64">
                    <SelectItem value="all" className="text-xs font-medium text-slate-400">All Pipeline Stages</SelectItem>
                    <SelectItem value="new" className="text-xs font-medium">New Application</SelectItem>
                    <SelectItem value="shortlisted" className="text-xs font-medium">Shortlisted</SelectItem>
                    <SelectItem value="interview_scheduled" className="text-xs font-medium">Interview Scheduled</SelectItem>
                    <SelectItem value="demo_class" className="text-xs font-medium">Demo Class</SelectItem>
                    <SelectItem value="offered" className="text-xs font-medium">Offered</SelectItem>
                    <SelectItem value="hired" className="text-xs font-medium">Hired</SelectItem>
                    <SelectItem value="rejected" className="text-xs font-medium">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source / Entry Type Filter */}
              {sourceFilterOptions.length > 0 && (
                <div className="relative">
                  <Select
                    value={filters.source || 'all'}
                    onValueChange={(v) => updateFilter('source', v === 'all' ? '' : v)}
                  >
                    <SelectTrigger className="h-9 border-slate-200 rounded-lg focus:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg dark:bg-slate-800">
                      <SelectItem value="all" className="text-xs font-medium text-slate-400">All Sources</SelectItem>
                      <SelectItem value="ADMIN" className="text-xs font-medium">Walk-in (Admin)</SelectItem>
                      <SelectItem value="SCHOOL_LINK" className="text-xs font-medium">QR Scan / School Link</SelectItem>
                      <SelectItem value="SELF_APPLICANT" className="text-xs font-medium">Self Applied</SelectItem>
                      <SelectItem value="SUPER_ADMIN_IMPORT" className="text-xs font-medium">Imported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Mobile Search */}
              {section !== 'talent_pool' && (
                <div className="relative">
                  <Input
                    placeholder="Search mobile..."
                    className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                    value={filters.mobile}
                    onChange={(e) => updateFilter('mobile', e.target.value)}
                  />
                </div>
              )}

              {/* State Filter */}
              <SearchableSelect
                options={stateOptions}
                value={filters.stateId || ''}
                onChange={(v) => {
                  const state = states.find(s => s._id === v);
                  setFilters(prev => ({ ...prev, stateId: v, state: state?.name || '', cityId: '', city: '' }));
                  setPage(1);
                }}
                placeholder="All States"
                limit={Infinity}
              />

              {/* City Filter */}
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

              {/* Experience Filter */}
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Experience (years)"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.experience}
                  onChange={(e) => updateFilter('experience', e.target.value)}
                />
              </div>

              {/* Area Filter */}
              <div className="relative">
                <Input
                  placeholder="All Areas"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.area}
                  onChange={(e) => updateFilter('area', e.target.value)}
                />
              </div>

              {/* Min Salary Filter */}
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Min Monthly ₹"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.expectedSalaryMin}
                  onChange={(e) => updateFilter('expectedSalaryMin', e.target.value)}
                />
              </div>

              {/* Max Salary Filter */}
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Max Monthly ₹"
                  className="h-9 border-slate-200 rounded-lg focus-visible:ring-[#0F766E] dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
                  value={filters.expectedSalaryMax}
                  onChange={(e) => updateFilter('expectedSalaryMax', e.target.value)}
                />
              </div>

              {/* Bottom Drawer Actions */}
              <div className="col-span-2 md:col-span-4 flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                {hasAnyActiveFilter ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                  </Button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Select options to filter</span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                  className="h-8 px-3 text-xs font-bold rounded-lg border-slate-200 text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100"
                >
                  Done
                </Button>
              </div>

            </div>
          )}

        </CardContent>
      </Card>

      {/* Main Listing View Table Interface */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredCandidates.length}</span> candidates
            </div>
            {section === 'talent_pool' && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  className={viewMode === 'list' ? 'bg-[#0F766E] text-white h-9 rounded-xl text-xs font-bold' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 h-9 rounded-xl text-xs font-bold'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="mr-1.5 h-3.5 w-3.5" />
                  List View
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  className={viewMode === 'map' ? 'bg-[#0F766E] text-white h-9 rounded-xl text-xs font-bold shadow-md shadow-[#0F766E]/25' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 h-9 rounded-xl text-xs font-bold'}
                  onClick={() => setViewMode('map')}
                >
                  <MapIcon className="mr-1.5 h-3.5 w-3.5" />
                  Interactive Map View
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-5 w-5 text-[#0F766E] animate-spin" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
                Fetching candidate universe...
              </p>
            </div>
          ) : (
            <div className="w-full">
              {viewMode === 'map' ? (
                <div className="space-y-4 p-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 p-4 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#0F766E]" /> Interactive Talent Search Map
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Search any area or city above, click anywhere on map, or use GPS to extract location and find candidates within radius.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#0F766E] bg-[#0F766E]/10 px-3 py-1 rounded-full border border-[#0F766E]/20">
                        {filteredCandidates.length} Active Candidates
                      </span>
                    </div>
                    <div className="p-4">
                      <MapView 
                        candidates={filteredCandidates} 
                        schoolLocation={data?.schoolLocation}
                        workingRadius={filters.nearby ? Number(filters.radiusKm) || 15 : 15}
                        height="520px"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCandidates.map((c) => (
                      <div key={c._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.fullName}</p>
                              <p className="text-xs text-[#0F766E] font-semibold">{c.position}</p>
                            </div>
                            {Number.isFinite(c.distanceKm) ? (
                              <Badge className="rounded-full border-[#0F766E]/20 bg-[#0F766E]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0F766E]">
                                {c.distanceKm.toFixed(1)} km away
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{formatCandidateLocation(c)}</p>
                          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">📍 {c.area || 'Area not specified'}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Exp: {c.experience || 'N/A'}</span>
                          <Link to={`/candidates/${c._id}`} className="text-[#8A3BD4] hover:underline font-bold text-xs flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> View Profile
                          </Link>
                        </div>
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
                        <Card key={c._id} className="border border-slate-200/80 bg-white shadow-2xs dark:bg-slate-900 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-all">
                          <CardContent className="p-3.5 space-y-2.5">
                            {/* Top Section: Avatar + Name/Role */}
                            <div className="flex items-start gap-3">
                              {/* Photo */}
                              <div className="shrink-0 pt-0.5">
                                {c.profilePhoto ? (
                                  <div className="h-11 w-11 rounded-xl p-0.5 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xs">
                                    <img
                                      src={c.profilePhoto}
                                      alt={c.fullName}
                                      className="h-full w-full rounded-lg object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-11 w-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] font-extrabold text-sm flex items-center justify-center border border-teal-200/60 shadow-2xs">
                                    {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </div>
                              
                              {/* Name and Position */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{c.fullName}</span>
                                  {c.status && c.status !== 'new' && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                                      c.status === 'shortlisted' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                      c.status === 'interview_scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      c.status === 'demo_class' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                      c.status === 'offered' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                      c.status === 'hired' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold' :
                                      c.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {c.status.replace(/_/g, ' ')}
                                    </span>
                                  )}
                                  {c.isLocked && (
                                    <Badge className="text-[9px] uppercase font-bold tracking-wider border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-md px-1 py-0 shadow-none variant-outline shrink-0">
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 font-semibold text-xs truncate mt-0.5">
                                  {c.position}
                                  {c.subjects?.length > 0 && (
                                    <span className="text-[#0F766E] font-medium text-[11px]"> • {c.subjects.join(', ')}</span>
                                  )}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                  <span>{c.experienceYears > 0 ? `${c.experienceYears} yrs exp` : 'Fresher'}</span>
                                  {c.expectedSalary ? (
                                    <>
                                      <span>•</span>
                                      <span className="font-semibold text-slate-600 dark:text-slate-300 font-mono">₹{c.expectedSalary.toLocaleString('en-IN')}</span>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {/* Bottom Communication & Action Bar - ALL 4 BUTTONS IN CLEAN UNIFORM BOXES IN ONE LINE */}
                            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono truncate">
                                {!c.isLocked && c.mobile ? c.mobile : (c.isLocked ? '••••••••••' : '—')}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {!c.isLocked && c.mobile && (
                                  <>
                                    <a
                                      href={`tel:${c.mobile}`}
                                      className="h-7 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 text-xs font-bold flex items-center gap-1 border border-blue-200/70 shadow-2xs transition-colors"
                                      title="Call Candidate"
                                    >
                                      <Phone className="h-3 w-3" />
                                      <span>Call</span>
                                    </a>
                                    <a
                                      href={`https://wa.me/91${String(c.whatsappNumber || c.mobile).replace(/\D/g, '').slice(-10)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="h-7 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-200/70 shadow-2xs transition-colors"
                                      title="WhatsApp Candidate"
                                    >
                                      <WhatsAppIcon className="h-3 w-3 fill-emerald-600 dark:fill-emerald-400" />
                                      <span>WhatsApp</span>
                                    </a>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDocsModalCandidate(c);
                                  }}
                                  className="h-7 w-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 flex items-center justify-center border border-purple-200/70 shadow-2xs transition-colors cursor-pointer relative"
                                  title="View Documents"
                                >
                                  <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                  {c.documents?.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-600 text-white text-[8px] font-extrabold flex items-center justify-center">
                                      {c.documents.length}
                                    </span>
                                  )}
                                </button>
                                <Link
                                  to={`/candidates/${c._id}`}
                                  className="h-7 w-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 flex items-center justify-center border border-purple-200/70 shadow-2xs transition-colors"
                                  title="View Biodata"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Link>
                                {c.canEdit && (
                                  <Link
                                    to={`/candidates/${c._id}/edit`}
                                    className="h-7 w-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center border border-amber-200/70 shadow-2xs transition-colors"
                                    title="Edit Candidate"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Link>
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
                          
                          <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider py-2.5 px-3 hidden md:table-cell min-w-[120px]">
                            <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-[#0F766E]" /> Contact</div>
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
                            className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-3 px-3 hidden lg:table-cell whitespace-nowrap min-w-[105px]'} 
                            onClick={() => handleSort('createdAt')}
                          >
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Date
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            </div>
                          </TableHead>
                          
                          <TableHead className="text-right text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pr-4 py-3 min-w-[135px] whitespace-nowrap">Actions</TableHead>
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
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 last:border-none transition-colors group"
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
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="group-hover:text-[#0F766E] transition-colors truncate">{c.fullName}</span>
                                  {c.status && c.status !== 'new' && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                                      c.status === 'shortlisted' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                      c.status === 'interview_scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      c.status === 'demo_class' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                      c.status === 'offered' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                      c.status === 'hired' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold' :
                                      c.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {c.status.replace(/_/g, ' ')}
                                    </span>
                                  )}
                                  {c.isLocked && (
                                    <Badge className="text-[9px] uppercase font-bold tracking-wider border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-md px-1 py-0 shadow-none variant-outline shrink-0">
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              
                              <TableCell className="text-slate-600 dark:text-slate-300 font-semibold text-xs py-2.5 px-3">
                                <div className="truncate">{c.position}</div>
                                {c.subjects?.length > 0 && (
                                  <div className="text-[10px] text-[#0F766E] font-medium truncate max-w-[140px]" title={c.subjects.join(', ')}>
                                    {c.subjects.join(', ')}
                                  </div>
                                )}
                              </TableCell>
                              
                              <TableCell className="py-2.5 px-3 hidden md:table-cell">
                                {!c.isLocked && c.mobile ? (
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs font-mono tracking-tight">
                                      {c.mobile}
                                    </span>
                                    {c.email && (
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[130px]" title={c.email}>
                                        {c.email}
                                      </span>
                                    )}
                                  </div>
                                ) : c.isLocked ? (
                                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Locked
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">—</span>
                                )}
                              </TableCell>

                              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs py-2.5 px-3 truncate hidden lg:table-cell max-w-[130px]">
                                {c.qualifications?.join(', ') || '—'}
                              </TableCell>
                              
                              <TableCell className="py-2.5 px-3 hidden md:table-cell text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {c.experienceYears > 0 ? `${c.experienceYears} yrs` : <span className="text-slate-400 font-normal">Fresher</span>}
                              </TableCell>
                              
                              <TableCell className="py-2.5 px-3 hidden md:table-cell text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                                {c.expectedSalary ? (
                                  `₹${c.expectedSalary.toLocaleString('en-IN')}`
                                ) : (
                                  <span className="text-slate-400 font-normal font-sans">—</span>
                                )}
                              </TableCell>
                              
                              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-xs py-2.5 px-3 hidden lg:table-cell whitespace-nowrap min-w-[105px]">
                                {formatDate(c.createdAt)}
                              </TableCell>
                              
                              <TableCell className="text-right pr-4 py-2.5">
                                <div className="flex justify-end items-center gap-1.5">
                                  {!c.isLocked && c.mobile && (
                                    <a
                                      href={`tel:${c.mobile}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-7 w-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center border border-blue-200/70 transition-all hover:scale-105 shadow-2xs"
                                      title={`Call ${c.mobile}`}
                                    >
                                      <Phone className="h-3.5 w-3.5" />
                                    </a>
                                  )}

                                  {!c.isLocked && (c.whatsappNumber || c.mobile) && (
                                    <a
                                      href={`https://wa.me/91${String(c.whatsappNumber || c.mobile).replace(/\D/g, '').slice(-10)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="h-7 w-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/70 transition-all hover:scale-105 shadow-2xs"
                                      title="WhatsApp Chat"
                                    >
                                      <WhatsAppIcon className="h-3.5 w-3.5 fill-emerald-600 dark:fill-emerald-400" />
                                    </a>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDocsModalCandidate(c);
                                    }}
                                    className="h-7 w-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 flex items-center justify-center border border-purple-200/70 transition-all hover:scale-105 shadow-2xs cursor-pointer relative"
                                    title="View Attached Documents"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                    {c.documents?.length > 0 && (
                                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-600 text-white text-[8px] font-extrabold flex items-center justify-center">
                                        {c.documents.length}
                                      </span>
                                    )}
                                  </button>

                                  <Link
                                    to={`/candidates/${c._id}`}
                                    className="h-7 w-7 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 flex items-center justify-center border border-purple-200/70 transition-all hover:scale-105 shadow-2xs"
                                    title="View Biodata"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Link>
                                  
                                  {c.canEdit && (
                                    <Link
                                      to={`/candidates/${c._id}/edit`}
                                      className="h-7 w-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center border border-amber-200/70 transition-all hover:scale-105 shadow-2xs"
                                      title="Edit Candidate"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Link>
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

      {/* Candidate Documents Modal */}
      <CandidateDocumentsModal
        isOpen={!!docsModalCandidate}
        onClose={() => setDocsModalCandidate(null)}
        candidate={docsModalCandidate}
      />
    </div>
  );
}

export default function MyCandidates() {
  return (
    <CandidateList
      section="my_candidates"
      title="My Candidates"
      description="Candidates added directly or received via school apply links."
      showAddButton
    />
  );
}

export function TalentPool() {
  return (
    <CandidateList
      section="talent_pool"
      title="Talent Pool"
      description="Verified candidates from the shared educator talent pool."
      sourceFilterOptions={[]}
    />
  );
}