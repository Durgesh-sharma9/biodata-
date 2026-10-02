import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, Power, Pencil, Building2, Mail, Phone, ShieldCheck, 
  Calendar, Filter, Sparkles, AlertCircle, Loader2, CheckCircle2,
  RefreshCcw, ChevronLeft, ChevronRight, X, LogIn, KeyRound,
  Eye, Download, Printer, CheckSquare, Square
} from 'lucide-react';
import { getSchools, toggleSchoolStatus, updateSchool, impersonateSchool, getSuperAdminCandidatesExport } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { exportCandidatesToCSV, printCandidatesReport } from '@/lib/exportUtils';
import { SchoolDetailsModal } from '@/components/admin/SchoolDetailsModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatDate, cn } from '@/lib/utils';
import { LocationSelect } from '@/components/common/LocationSelect';

const emptyForm = {
  schoolName: '',
  email: '',
  phone: '',
  subscriptionPlan: 'basic',
  subscriptionStatus: 'trial',
  startDate: '',
  expiryDate: '',
};

export default function Schools() {
  const navigate = useNavigate();
  const { impersonate } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [location, setLocation] = useState({});
  const [impersonatingId, setImpersonatingId] = useState(null);
  const [viewSchoolId, setViewSchoolId] = useState(null);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState(new Set());

  const toggleSelectSchool = (schoolId) => {
    setSelectedSchoolIds((prev) => {
      const next = new Set(prev);
      if (next.has(schoolId)) next.delete(schoolId);
      else next.add(schoolId);
      return next;
    });
  };

  const handleExportCandidatesCSV = async () => {
    try {
      setIsExportingAll(true);
      const isFiltered = selectedSchoolIds.size > 0;
      const params = isFiltered
        ? { schoolIds: Array.from(selectedSchoolIds).join(',') }
        : {};

      const res = await getSuperAdminCandidatesExport(params);
      if (res.data?.success) {
        const filename = isFiltered
          ? `candidates_selected_${selectedSchoolIds.size}_schools_${new Date().toISOString().slice(0, 10)}.csv`
          : `hirehub_all_schools_candidates_${new Date().toISOString().slice(0, 10)}.csv`;
        exportCandidatesToCSV(res.data.data, filename);
      }
    } catch (err) {
      console.error('Failed to export candidates:', err);
      alert('Failed to export candidates. Please try again.');
    } finally {
      setIsExportingAll(false);
    }
  };

  const handlePrintCandidatesPDF = async () => {
    try {
      setIsExportingAll(true);
      const isFiltered = selectedSchoolIds.size > 0;
      const params = isFiltered
        ? { schoolIds: Array.from(selectedSchoolIds).join(',') }
        : {};

      const res = await getSuperAdminCandidatesExport(params);
      if (res.data?.success) {
        const title = isFiltered
          ? `Candidates Report - ${selectedSchoolIds.size} Selected School(s)`
          : 'Platform Master Roll - All Schools Candidates';
        printCandidatesReport(res.data.data, title);
      }
    } catch (err) {
      console.error('Failed to print candidates report:', err);
      alert('Failed to generate candidates report. Please try again.');
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleImpersonate = async (school) => {
    try {
      setImpersonatingId(school._id);
      const res = await impersonateSchool(school._id);
      if (res.data?.success) {
        await impersonate(res.data);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to enter stealth session:', err);
      alert(err.response?.data?.message || 'Failed to login as school');
    } finally {
      setImpersonatingId(null);
    }
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['schools', page, search, status],
    queryFn: () =>
      getSchools({
        page,
        limit: 10,
        search,
        status: status || undefined,
      }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setDialogOpen(false);
      setEditSchool(null);
      setForm(emptyForm);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleSchoolStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schools'] }),
  });

  const openEdit = (school) => {
    setEditSchool(school);
    setForm({
      schoolName: school.schoolName || '',
      email: school.email || '',
      phone: school.phone || '',
      subscriptionPlan: school.subscriptionPlan || 'basic',
      subscriptionStatus: school.subscriptionStatus || 'trial',
      startDate: school.startDate ? school.startDate.split('T')[0] : '',
      expiryDate: school.expiryDate ? school.expiryDate.split('T')[0] : '',
    });
    setLocation({
      stateId: school.stateId || '',
      cityId: school.cityId || '',
      area: school.area || '',
      address: school.address || '',
      latitude: school.latitude ?? '',
      longitude: school.longitude ?? '',
      workingRadius: school.workingRadius ?? '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editSchool) {
      updateMutation.mutate({ id: editSchool._id, data: { ...form, ...location } });
    }
  };

  const schoolsList = data?.data || [];
  const totalCount = data?.pagination?.total || schoolsList.length || 0;
  const totalPages = data?.pagination?.pages || Math.ceil(totalCount / 10) || 1;

  const activeCount = schoolsList.filter((s) => s.isActive || s.subscriptionStatus === 'active').length;
  const trialCount = schoolsList.filter((s) => s.subscriptionStatus === 'trial').length;

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-[#8A3BD4] dark:text-purple-300 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Institutions & Schools Management
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 shrink-0">
                {totalCount} Total Institutions
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Review school registrations, modify license bundles, and toggle operational access
            </p>
          </div>
        </div>
        
        {/* Quick Action / Refresh & Candidate Exports (All or Selected Schools) */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedSchoolIds.size > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-100/90 dark:bg-purple-950/70 border border-purple-200 text-[#8A3BD4] dark:text-purple-300 text-xs font-bold shrink-0 animate-in fade-in duration-200">
              <span>{selectedSchoolIds.size} School(s) Selected</span>
              <button 
                onClick={() => setSelectedSchoolIds(new Set())}
                className="hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer transition-colors"
                title="Clear School Selection"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCandidatesCSV}
            disabled={isExportingAll}
            className={cn(
              "h-9 px-3 rounded-xl border font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all",
              selectedSchoolIds.size > 0
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400/20"
                : "border-emerald-200/90 bg-white dark:bg-slate-800 hover:bg-emerald-50 text-emerald-700 dark:text-emerald-300"
            )}
            title={
              selectedSchoolIds.size > 0
                ? `Download Candidates for ${selectedSchoolIds.size} Selected School(s) as Excel (CSV)`
                : "Download All Candidates Across All Schools as Excel (CSV)"
            }
          >
            {isExportingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" /> : <Download className="h-3.5 w-3.5 text-emerald-600" />}
            <span>
              {selectedSchoolIds.size > 0 
                ? `Export Selected (${selectedSchoolIds.size}) Excel` 
                : 'Export All (Excel)'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintCandidatesPDF}
            disabled={isExportingAll}
            className={cn(
              "h-9 px-3 rounded-xl border font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-1.5 transition-all",
              selectedSchoolIds.size > 0
                ? "border-indigo-300 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-400/20"
                : "border-indigo-200/90 bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-700 dark:text-indigo-300"
            )}
            title={
              selectedSchoolIds.size > 0
                ? `Print / Save PDF for ${selectedSchoolIds.size} Selected School(s)`
                : "Print / Save PDF of All Candidates Across All Schools"
            }
          >
            <Printer className="h-3.5 w-3.5 text-indigo-600" />
            <span>
              {selectedSchoolIds.size > 0 
                ? `Export Selected (${selectedSchoolIds.size}) PDF` 
                : 'Export All (PDF)'}
            </span>
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()} 
            disabled={isFetching}
            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 shadow-2xs group/btn cursor-pointer shrink-0"
            title="Refresh Data"
          >
            <RefreshCcw className={cn(
              "h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:rotate-180", 
              isFetching && "animate-spin text-[#8A3BD4]"
            )} />
          </Button>
        </div>
      </div>

      {/* ─── 2. MINI STATS OVERVIEW ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Total Schools
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 dark:text-white mt-1">
              {totalCount}
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Registered on platform</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
              Active Status
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-white mt-1">
              {activeCount}
            </h3>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">Enabled for recruitment</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#EFF6FF] via-white to-cyan-50/50 dark:bg-slate-900 border border-cyan-200/80 dark:border-cyan-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              Evaluation / Trial
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {trialCount}
            </h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">Pending plan conversion</p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-100/80 dark:bg-cyan-950/60 text-[#00D2FF] dark:text-cyan-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 3. SEARCH & FILTER TOOLBAR ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl">
        <CardContent className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by school name, email, or city..."
              className="pl-10 h-10 border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus-visible:ring-purple-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={status || 'all'} 
              onValueChange={(v) => { 
                setStatus(v === 'all' ? '' : v); 
                setPage(1); 
              }}
            >
              <SelectTrigger className="w-full sm:w-44 h-10 border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:bg-slate-800">
                <SelectItem value="all" className="font-semibold text-xs">All Statuses</SelectItem>
                <SelectItem value="active" className="font-semibold text-xs text-emerald-600">Active Only</SelectItem>
                <SelectItem value="inactive" className="font-semibold text-xs text-rose-600">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ─── 4. SCHOOLS DATA TABLE ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-7 w-7 text-[#8A3BD4] animate-spin" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading registered schools...</span>
              </div>
            </div>
          ) : !schoolsList || schoolsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-slate-800 text-[#8A3BD4] mb-3">
                <AlertCircle className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No Matching Schools Found</h4>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search query or clear status filters to view registered institutions.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="w-10 px-3 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSchoolIds.size === schoolsList.length && schoolsList.length > 0) {
                            setSelectedSchoolIds(new Set());
                          } else {
                            setSelectedSchoolIds(new Set(schoolsList.map((s) => s._id)));
                          }
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer inline-flex items-center justify-center transition-colors"
                        title={
                          selectedSchoolIds.size > 0 && selectedSchoolIds.size === schoolsList.length
                            ? "Deselect All Schools"
                            : "Select All Schools on this page"
                        }
                      >
                        {selectedSchoolIds.size > 0 && selectedSchoolIds.size === schoolsList.length ? (
                          <CheckSquare className="h-4 w-4 text-[#8A3BD4]" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="pl-3 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">School Name</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Email / Mobile</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Plan Tier</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Billing Status</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Access State</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Expiry Date</TableHead>
                    <TableHead className="pr-5 text-right font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolsList.map((school) => {
                    const isSelected = selectedSchoolIds.has(school._id);
                    return (
                    <TableRow 
                      key={school._id} 
                      className={cn(
                        "group hover:bg-purple-50/30 dark:hover:bg-slate-800/40 transition-all border-b border-slate-100 dark:border-slate-800/60 last:border-none",
                        isSelected && "bg-purple-50/50 dark:bg-purple-950/25"
                      )}
                    >
                      {/* Checkbox */}
                      <TableCell className="w-10 px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectSchool(school._id)}
                          className="p-1 rounded cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center justify-center transition-colors"
                          title={isSelected ? "Deselect School" : "Select School for Export"}
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[#8A3BD4]" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                      </TableCell>

                      {/* School Name & Avatar */}
                      <TableCell className="pl-3 py-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300 font-extrabold text-xs shadow-2xs overflow-hidden">
                            {school.logoUrl ? (
                              <img src={school.logoUrl} alt="" className="h-full w-full object-contain p-0.5" />
                            ) : (
                              school.schoolName ? school.schoolName.charAt(0).toUpperCase() : 'S'
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="truncate block max-w-[200px] sm:max-w-[240px] font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-[#8A3BD4] transition-colors">
                              {school.schoolName}
                            </span>
                            {school.city && (
                              <span className="text-[10.5px] text-slate-400 font-medium block truncate">
                                {school.city}{school.area ? `, ${school.area}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell className="py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{school.email}</span>
                          </div>
                          {school.phone && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{school.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Plan Tier Badge */}
                      <TableCell className="py-4">
                        <Badge 
                          variant="outline" 
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border-purple-200/80 bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 shadow-none uppercase"
                        >
                          {school.subscriptionPlan || 'Basic'}
                        </Badge>
                      </TableCell>

                      {/* Subscription Status */}
                      <TableCell className="py-4">
                        <Badge 
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-lg border shadow-none uppercase tracking-wide",
                            school.subscriptionStatus === 'active' 
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                              : school.subscriptionStatus === 'trial'
                              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500'
                          )}
                        >
                          {school.subscriptionStatus || 'trial'}
                        </Badge>
                      </TableCell>

                      {/* Active / Inactive Switch State */}
                      <TableCell className="py-4">
                        {school.isActive !== false ? (
                          <Badge className="border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-none flex items-center gap-1 w-fit">
                            <span className="h-1.5 w-1.5 rounded-full inline-block bg-emerald-500 animate-pulse" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="border-rose-200/80 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-none flex items-center gap-1 w-fit">
                            <span className="h-1.5 w-1.5 rounded-full inline-block bg-rose-500" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>

                      {/* Expiry Date */}
                      <TableCell className="py-4 text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(school.expiryDate)}</span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setViewSchoolId(school._id)}
                            className="h-8 w-8 rounded-lg border-indigo-200/90 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer"
                            title="View School Profile, Candidates & Export"
                          >
                            <Eye className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleImpersonate(school)}
                            disabled={impersonatingId === school._id}
                            className="h-8 w-8 rounded-lg border-amber-200/90 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer"
                            title="Stealth Login as this School (Zero notifications or alerts sent)"
                          >
                            {impersonatingId === school._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" />
                            ) : (
                              <LogIn className="h-3.5 w-3.5 text-amber-600" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEdit(school)}
                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-[#8A3BD4] hover:border-[#8A3BD4]/40 hover:bg-purple-50/50 transition-all cursor-pointer"
                            title="Edit School Parameters"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleMutation.mutate(school._id)}
                            disabled={toggleMutation.isPending}
                            className={cn(
                              "h-8 w-8 rounded-lg border transition-all cursor-pointer",
                              school.isActive !== false
                                ? "border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                            )}
                            title={school.isActive !== false ? "Suspend / Deactivate School" : "Activate School"}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2.5 rounded-lg text-xs font-bold"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-2.5 rounded-lg text-xs font-bold"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── 5. EDIT SCHOOL MODAL ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-950/60 text-[#8A3BD4] rounded-lg">
                <Building2 className="h-4 w-4" />
              </div>
              <span>Edit School Details & Subscription</span>
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="pt-3">
            <form id="school-mgmt-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* School Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">School Official Name *</Label>
                  <Input
                    value={form.schoolName}
                    onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                    placeholder="Enter school name..."
                    className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    required
                  />
                </div>
                
                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Registered Email Address</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={form.email}
                      className="pl-9 h-10 border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed text-xs sm:text-sm font-medium"
                      disabled
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                
                {/* Phone */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Mobile / Phone</Label>
                  <div className="relative">
                    <Input 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      placeholder="+91 98765 43210"
                      className="pl-9 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                
                {/* Subscription Plan */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subscription Plan Tier</Label>
                  <Select value={form.subscriptionPlan} onValueChange={(v) => setForm({ ...form, subscriptionPlan: v })}>
                    <SelectTrigger className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-slate-800">
                      <SelectItem value="basic" className="text-xs font-semibold">Basic Tier</SelectItem>
                      <SelectItem value="standard" className="text-xs font-semibold">Standard Tier</SelectItem>
                      <SelectItem value="premium" className="text-xs font-semibold">Premium Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Subscription Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Billing Status</Label>
                  <Select value={form.subscriptionStatus} onValueChange={(v) => setForm({ ...form, subscriptionStatus: v })}>
                    <SelectTrigger className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl dark:bg-slate-800">
                      <SelectItem value="trial" className="text-xs font-semibold text-amber-600">Trial Evaluation</SelectItem>
                      <SelectItem value="active" className="text-xs font-semibold text-emerald-600">Active Paid Plan</SelectItem>
                      <SelectItem value="expired" className="text-xs font-semibold text-rose-600">Expired</SelectItem>
                      <SelectItem value="cancelled" className="text-xs font-semibold text-slate-400">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Start Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Date</Label>
                  <Input 
                    type="date" 
                    value={form.startDate} 
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                    className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium" 
                  />
                </div>
                
                {/* Expiry Date */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Expiry Date</Label>
                  <Input 
                    type="date" 
                    value={form.expiryDate} 
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} 
                    className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-medium" 
                  />
                </div>

                {/* Location Picker */}
                <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <LocationSelect value={location} onChange={setLocation} />
                </div>
                
              </div>
            </form>
          </DialogBody>
          <DialogFooter className="mt-5 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="rounded-xl h-10 px-4 font-bold text-xs border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="school-mgmt-form"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold rounded-xl h-10 px-5 text-xs shadow-sm cursor-pointer"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* View School Details & Candidates Modal */}
      <SchoolDetailsModal 
        schoolId={viewSchoolId} 
        isOpen={Boolean(viewSchoolId)} 
        onClose={() => setViewSchoolId(null)} 
      />
    </div>
  );
}