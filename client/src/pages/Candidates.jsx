import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, 
  Filter, MapPin, Briefcase, GraduationCap, Calendar, IndianRupee, 
  Users, ShieldAlert, SlidersHorizontal, ArrowUpDown, Loader2
} from 'lucide-react';
import { getCandidates, deleteCandidate, getSettings, getStates } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

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
    city: '',
    locality: '',
    source: '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [deleteId, setDeleteId] = useState(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', section, page, filters],
    queryFn: () =>
      getCandidates({
        section,
        page,
        limit: 10,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
      }).then((r) => r.data),
  });

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

  // UI helper for dynamic and vibrant source badges
  const getSourceBadge = (source) => {
    const formatStr = (str) => str?.replace(/_/g, ' ') || '';
    switch(source) {
      case 'ADMIN':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200/50 transition-colors font-medium rounded-full px-2.5 py-0.5">{formatStr(source)}</Badge>;
      case 'SCHOOL_LINK':
        return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200/50 transition-colors font-medium rounded-full px-2.5 py-0.5">{formatStr(source)}</Badge>;
      case 'SELF_APPLICANT':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50 transition-colors font-medium rounded-full px-2.5 py-0.5">{formatStr(source)}</Badge>;
      case 'SUPER_ADMIN_IMPORT':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200/50 transition-colors font-medium rounded-full px-2.5 py-0.5">{formatStr(source)}</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground border-slate-200/60 font-medium rounded-full px-2.5 py-0.5">Talent Pool</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 antialiased selection:bg-indigo-500/10 text-slate-800">
      {/* Page Header Section Wrap */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 md:p-8 shadow-xl border border-slate-800/40 group">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              {title}
            </h1>
            <p className="text-sm md:text-base text-slate-300/90 leading-relaxed font-medium">
              {description}
            </p>
          </div>
          {showAddButton && (
            <Button asChild className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold tracking-wide rounded-xl px-5 py-6 shadow-md shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center shrink-0 border border-indigo-400/20 group/btn">
              <Link to="/candidates/new">
                <Plus className="mr-2 h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-90" />
                Add Candidate
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filtering Control Center */}
      <Card className="border-slate-200/70 shadow-sm rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filter Engine</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            <div className="relative group">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Search by name..."
                className="pl-10 h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium"
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                placeholder="Search by mobile..."
                className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium"
                value={filters.mobile}
                onChange={(e) => updateFilter('mobile', e.target.value)}
              />
            </div>

            <Select value={filters.position || 'all'} onValueChange={(v) => updateFilter('position', v === 'all' ? '' : v)}>
              <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-slate-600 font-medium">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 max-h-64">
                <SelectItem value="all" className="font-medium text-slate-500">All Positions</SelectItem>
                {settings?.positions?.map((p) => (
                  <SelectItem key={p} value={p} className="focus:bg-indigo-50/70 focus:text-indigo-600 font-medium rounded-lg">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.qualification || 'all'}
              onValueChange={(v) => updateFilter('qualification', v === 'all' ? '' : v)}
            >
              <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-slate-600 font-medium">
                <SelectValue placeholder="All Qualifications" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 max-h-64">
                <SelectItem value="all" className="font-medium text-slate-500">All Qualifications</SelectItem>
                {settings?.qualifications?.map((q) => (
                  <SelectItem key={q} value={q} className="focus:bg-indigo-50/70 focus:text-indigo-600 font-medium rounded-lg">
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                type="number"
                placeholder="Experience (years)"
                className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium"
                value={filters.experience}
                onChange={(e) => updateFilter('experience', e.target.value)}
              />
            </div>

            <Select value={filters.state || 'all'} onValueChange={(v) => updateFilter('state', v === 'all' ? '' : v)}>
              <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-slate-600 font-medium">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 max-h-64">
                <SelectItem value="all" className="font-medium text-slate-500">All States</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s._id} value={s.name} className="focus:bg-indigo-50/70 focus:text-indigo-600 font-medium rounded-lg">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input placeholder="City" className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium" value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} />
            
            <Input placeholder="Locality" className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium" value={filters.locality} onChange={(e) => updateFilter('locality', e.target.value)} />
            
            {section !== 'talent_pool' && (
              <Select value={filters.source || 'all'} onValueChange={(v) => updateFilter('source', v === 'all' ? '' : v)}>
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-slate-600 font-medium">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 max-h-64">
                  <SelectItem value="all" className="font-medium text-slate-500">All Sources</SelectItem>
                  {sourceFilterOptions.map((s) => (
                    <SelectItem key={s} value={s} className="focus:bg-indigo-50/70 focus:text-indigo-600 font-medium rounded-lg">
                      {s.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="relative">
              <Input
                type="number"
                placeholder="Min Salary"
                className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium"
                value={filters.expectedSalaryMin}
                onChange={(e) => updateFilter('expectedSalaryMin', e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                type="number"
                placeholder="Max Salary"
                className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium"
                value={filters.expectedSalaryMax}
                onChange={(e) => updateFilter('expectedSalaryMax', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Listing View Wrapper */}
      <Card className="border-slate-200/70 shadow-md shadow-slate-100/50 rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            /* Premium Loading Skeleton / State Component Wrap */
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin relative z-10" />
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse scale-150" />
              </div>
              <p className="text-slate-500 font-semibold tracking-wide text-sm animate-pulse">
                Fetching candidate universe...
              </p>
            </div>
          ) : (
            <>
              {/* Responsive Container for Professional Table Grid */}
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <Table className="min-w-[1000px]">
                  <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[80px] text-slate-500 font-bold text-xs uppercase tracking-wider pl-6">Photo</TableHead>
                      
                      <TableHead 
                        className="text-slate-500 font-bold text-xs uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group select-none" 
                        onClick={() => handleSort('fullName')}
                      >
                        <div className="flex items-center gap-1.5">
                          Name
                          <ArrowUpDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-slate-500 font-bold text-xs uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group select-none" 
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center gap-1.5">
                          Position
                          <ArrowUpDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableHead>
                      
                      <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-400" /> Location</div>
                      </TableHead>
                      
                      {section === 'talent_pool' && (
                        <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                          <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-slate-400" /> Pool</div>
                        </TableHead>
                      )}
                      
                      <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3 text-slate-400" /> Qualification</div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-slate-500 font-bold text-xs uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group select-none" 
                        onClick={() => handleSort('experienceYears')}
                      >
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3 w-3 text-slate-400" /> Experience
                          <ArrowUpDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-slate-500 font-bold text-xs uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group select-none" 
                        onClick={() => handleSort('expectedSalary')}
                      >
                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="h-3 w-3 text-slate-400" /> Expected Salary
                          <ArrowUpDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableHead>
                      
                      <TableHead 
                        className="text-slate-500 font-bold text-xs uppercase tracking-wider cursor-pointer hover:text-indigo-600 transition-colors group select-none" 
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400" /> Date Added
                          <ArrowUpDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableHead>
                      
                      <TableHead className="text-right text-slate-500 font-bold text-xs uppercase tracking-wider pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody className="divide-y divide-slate-100/70">
                    {data?.data?.length === 0 ? (
                      /* Enhanced Premium Empty State Component inside Table */
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={section === 'talent_pool' ? 10 : 9} className="py-20 text-center">
                          <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/50 rounded-2xl shadow-inner text-slate-400 group-hover:scale-105 transition-transform">
                              <Users className="h-10 w-10 text-indigo-400" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-bold text-slate-700">No candidates detected</h3>
                              <p className="text-sm text-slate-400 font-medium">
                                We couldn't find matches for your active parameters. Try expanding your filters or add a new record.
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.data?.map((c) => (
                        <TableRow key={c._id} className="hover:bg-slate-50/60 transition-colors group/row">
                          <TableCell className="pl-6">
                            {c.profilePhoto ? (
                              <div className="relative h-11 w-11 rounded-full p-0.5 border-2 border-slate-100 shadow-inner overflow-hidden group-hover/row:border-indigo-400 transition-colors">
                                <img
                                  src={c.profilePhoto}
                                  alt={c.fullName}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-600 font-bold text-sm flex items-center justify-center border border-slate-200/40 shadow-inner group-hover/row:from-indigo-100 group-hover/row:text-indigo-700 transition-colors">
                                {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                          </TableCell>
                          
                          <TableCell className="font-semibold text-slate-700 tracking-tight text-sm">
                            <div className="flex items-center gap-2">
                              <span className="group-hover/row:text-indigo-600 transition-colors">{c.fullName}</span>
                              {c.isLocked && (
                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider bg-rose-50/50 text-rose-600 border-rose-200/60 rounded px-1.5 py-0">
                                  Locked
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-slate-600 font-medium text-sm">{c.position}</TableCell>
                          
                          <TableCell className="text-slate-500 font-medium text-xs max-w-[180px] truncate">
                            {[c.city, c.locality].filter(Boolean).join(', ') || '—'}
                          </TableCell>
                          
                          {section === 'talent_pool' && (
                            <TableCell className="align-middle">
                              {getSourceBadge(c.source)}
                            </TableCell>
                          )}
                          
                          <TableCell className="text-slate-600 font-medium text-xs max-w-[200px] truncate">
                            {c.qualifications?.join(', ') || '—'}
                          </TableCell>
                          
                          <TableCell className="text-slate-700 font-semibold text-sm">
                            <Badge variant="secondary" className="bg-slate-100/80 hover:bg-slate-200/60 text-slate-700 border border-slate-200/40 rounded-lg text-xs font-semibold px-2 py-0.5">
                              {c.experienceYears} yrs
                            </Badge>
                          </TableCell>
                          
                          <TableCell className="font-bold text-slate-800 text-sm">
                            {c.expectedSalary ? (
                              <span className="text-emerald-600 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                                ₹{c.expectedSalary.toLocaleString('en-IN')}
                              </span>
                            ) : c.isLocked ? (
                              <span className="text-slate-300 font-normal">—</span>
                            ) : (
                              <span className="text-slate-400 font-normal">-</span>
                            )}
                          </TableCell>
                          
                          <TableCell className="text-slate-500 font-medium text-xs">
                            {formatDate(c.createdAt)}
                          </TableCell>
                          
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover/row:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all">
                                <Link to={`/candidates/${c._id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              
                              {c.canEdit && (
                                <>
                                  <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all">
                                    <Link to={`/candidates/${c._id}/edit`}>
                                      <Pencil className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  
                                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(c._id)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
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
                <div className="p-5 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide text-center sm:text-left">
                    Displaying <span className="text-indigo-600 font-bold">Page {data.pagination.page}</span> of <span className="text-slate-700 font-bold">{data.pagination.totalPages}</span> <span className="text-slate-400">({data.pagination.total} entries total)</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page <= 1} 
                      onClick={() => setPage((p) => p - 1)}
                      className="h-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 font-bold transition-all disabled:opacity-40 shadow-sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="h-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 font-bold transition-all disabled:opacity-40 shadow-sm"
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

      {/* Premium Confirm Modal Overhaul */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-100 shadow-2xl p-6 bg-white gap-0">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="text-lg font-bold text-slate-800">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 font-medium leading-relaxed">
                This action will safely soft-delete this candidate from your secure school ecosystem database workspace.
              </DialogDescription>
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteId(null)}
              className="w-full sm:w-auto h-11 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Keep Candidate
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteMutation.mutate(deleteId)} 
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto h-11 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
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
      sourceFilterOptions={['SELF_APPLICANT']}
    />
  );
}