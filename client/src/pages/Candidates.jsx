import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, 
  MapPin, Briefcase, GraduationCap, Calendar, IndianRupee, 
  Users, ShieldAlert, SlidersHorizontal, ArrowUpDown, Loader2
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
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { formatCandidateLocation, buildLocationSearchText } from '@/lib/location';

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

    return data.data.filter((candidate) => {
      const searchText = buildLocationSearchText(candidate);
      const query = (filters.name || '').trim().toLowerCase();
      const matchesSearch = !query || searchText.includes(query);
      const matchesState = !filters.state || (candidate.state || '').toLowerCase().includes(filters.state.toLowerCase());
      const matchesCity = !filters.city || (candidate.city || '').toLowerCase().includes(filters.city.toLowerCase());
      const matchesArea = !filters.area || (candidate.area || '').toLowerCase().includes(filters.area.toLowerCase());
      return matchesSearch && matchesState && matchesCity && matchesArea;
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

  // Modern Soft-Tint Badges customized cleanly for the Purple Theme specifications
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

  return (
    <div className="space-y-6 p-5 max-w-[1400px] mx-auto w-full bg-[#f3f3f4] dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen">
      {/* Minimalist Page Header Panel Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <PageHeader
          title={title}
          description={description}
          className="text-slate-800 dark:text-white font-bold tracking-tight text-xl"
        />
        {showAddButton && (
          <Button asChild className="bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shrink-0 shadow-md shadow-[#A05AFF]/20">
            <Link to="/candidates/new">
              <Plus className="mr-2 h-4 w-4 stroke-[3]" />
              Add Candidate
            </Link>
          </Button>
        )}
      </div>

      {/* Advanced Filtering Control Center */}
      <Card className="filter">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10">
              <SlidersHorizontal className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Filter Engine</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#A05AFF] transition-colors" />
              <Input
                placeholder="Search by name, area, city, state..."
                className="pl-10 h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
              />
            </div>

            {section !== 'talent_pool' && (
              <div className="relative">
                <Input
                  placeholder="Search by mobile..."
                  className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                  value={filters.mobile}
                  onChange={(e) => updateFilter('mobile', e.target.value)}
                />
              </div>
            )}

            <Select value={filters.position || 'all'} onValueChange={(v) => updateFilter('position', v === 'all' ? '' : v)}>
              <SelectTrigger className="h-11 border-slate-200 rounded-xl focus:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-sm font-medium">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:bg-slate-800 max-h-64">
                <SelectItem value="all" className="font-medium text-slate-400">All Positions</SelectItem>
                {settings?.positions?.map((p) => (
                  <SelectItem key={p} value={p} className="font-medium rounded-lg">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.qualification || 'all'}
              onValueChange={(v) => updateFilter('qualification', v === 'all' ? '' : v)}
            >
              <SelectTrigger className="h-11 border-slate-200 rounded-xl focus:ring-[#A05AFF] dark:bg-slate-800 dark:border-slate-700 text-sm font-medium">
                <SelectValue placeholder="All Qualifications" />
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:bg-slate-800 max-h-64">
                <SelectItem value="all" className="font-medium text-slate-400">All Qualifications</SelectItem>
                {settings?.qualifications?.map((q) => (
                  <SelectItem key={q} value={q} className="font-medium rounded-lg">
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                type="number"
                placeholder="Experience (years)"
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
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
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                value={filters.area}
                onChange={(e) => updateFilter('area', e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                type="number"
                placeholder="Min Monthly Salary"
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                value={filters.expectedSalaryMin}
                onChange={(e) => updateFilter('expectedSalaryMin', e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                type="number"
                placeholder="Max Monthly Salary"
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                value={filters.expectedSalaryMax}
                onChange={(e) => updateFilter('expectedSalaryMax', e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <input
                type="checkbox"
                checked={!!filters.nearby}
                onChange={(e) => updateFilter('nearby', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#A05AFF]"
              />
              Nearby only
            </label>

            <div className="relative">
              <Input
                type="number"
                placeholder="Radius (km)"
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                value={filters.radiusKm}
                onChange={(e) => updateFilter('radiusKm', e.target.value)}
                disabled={!filters.nearby}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Listing View Table Interface */}
      <Card className="table">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-5 w-5 text-[#A05AFF] animate-spin" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
                Fetching candidate universe...
              </p>
            </div>
          ) : (
            <>
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
                      <TableHead className="w-[50px] md:w-[60px] text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pl-4 md:pl-6 py-4">Photo</TableHead>
                      
                      <TableHead 
                        className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-4" 
                        onClick={() => handleSort('fullName')}
                      >
                        <div className="flex items-center gap-1.5">
                          Name
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-4" 
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center gap-1.5">
                          Position
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </TableHead>
                      
                      <TableHead className="text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Location</div>
                      </TableHead>

                      <TableHead className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider py-4 hidden lg:table-cell'}>
                        <div className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3" /> Qualification</div>
                      </TableHead>
                      
                      <TableHead 
                        className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-4 hidden md:table-cell'}
                        onClick={() => handleSort('experienceYears')}
                      >
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3 w-3" /> Experience
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </TableHead>
                      
                      <TableHead
                        className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-4 hidden md:table-cell'}
                        onClick={() => handleSort('expectedSalary')}
                      >
                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="h-3 w-3" /> Salary
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className={isTablet ? 'hidden' : 'text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors select-none py-4 hidden lg:table-cell'} 
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> Date
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        </div>
                      </TableHead>
                      
                      <TableHead className="text-right text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-wider pr-4 md:pr-6 py-4 w-[60px] md:w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredCandidates.length === 0 ? (
                      <TableRow className="hover:bg-transparent border-none">
                        <TableCell colSpan={9} className="py-20 text-center">
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
                          <TableCell className="pl-6 py-4">
                            {c.profilePhoto ? (
                              <div className="h-11 w-11 rounded-full p-0.5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <img
                                  src={c.profilePhoto}
                                  alt={c.fullName}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center border border-slate-200/40">
                                {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                          </TableCell>
                          
                          <TableCell className="font-bold text-slate-800 dark:text-slate-200 text-sm py-4">
                            <div className="flex items-center gap-2">
                              <span className="group-hover:text-[#A05AFF] transition-colors truncate">{c.fullName}</span>
                              {c.isLocked && (
                                <Badge className="text-[10px] uppercase font-bold tracking-wider border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-md px-1.5 py-0 shadow-none variant-outline shrink-0">
                                  Locked
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-slate-600 dark:text-slate-300 font-semibold text-sm py-4 truncate">{c.position}</TableCell>
                          
                          <TableCell className="text-slate-500 dark:text-slate-400 font-semibold text-xs py-4 truncate hidden md:table-cell">
                            {formatCandidateLocation(c)}{Number.isFinite(c.distanceKm) ? ` • ${c.distanceKm.toFixed(1)} km` : ''}
                          </TableCell>

                          <TableCell className="text-slate-500 dark:text-slate-400 font-semibold text-xs py-4 truncate hidden lg:table-cell">
                            {c.qualifications?.join(', ') || '—'}
                          </TableCell>
                          
                          <TableCell className="py-4 hidden md:table-cell">
                            <Badge className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold px-2 py-0.5 variant-outline shadow-none">
                              {c.experienceYears} yrs
                            </Badge>
                          </TableCell>
                          
                          <TableCell className="font-bold text-slate-800 dark:text-slate-200 text-sm py-4 hidden md:table-cell">
                            {c.expectedSalary ? (
                              <Badge className="border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] text-xs font-bold px-2.5 py-1 rounded-xl variant-outline shadow-none">
                                ₹{c.expectedSalary.toLocaleString('en-IN')}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-600 font-normal">—</span>
                            )}
                          </TableCell>
                          
                          <TableCell className="text-slate-500 dark:text-slate-400 font-semibold text-xs py-4 hidden lg:table-cell">
                            {formatDate(c.createdAt)}
                          </TableCell>
                          
                          <TableCell className="text-right pr-6 py-4">
                            <div className="flex justify-end items-center gap-1">
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
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

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
            </>
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