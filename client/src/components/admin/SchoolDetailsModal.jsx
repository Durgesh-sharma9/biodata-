import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Mail, Phone, MapPin, Calendar, Coins, ShieldCheck, 
  Users, Download, Printer, Search, Filter, Loader2, CheckSquare, 
  Square, LogIn, ExternalLink, X, Award, Briefcase, ChevronRight
} from 'lucide-react';
import { getSuperAdminSchoolDetails, impersonateSchool } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { exportCandidatesToCSV, printCandidatesReport } from '@/lib/exportUtils';
import { formatDate, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function SchoolDetailsModal({ schoolId, isOpen, onClose }) {
  const navigate = useNavigate();
  const { impersonate } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isImpersonating, setIsImpersonating] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['superAdminSchoolDetails', schoolId],
    queryFn: () => getSuperAdminSchoolDetails(schoolId).then((r) => r.data.data),
    enabled: Boolean(schoolId && isOpen),
  });

  const school = data?.school;
  const admin = data?.admin;
  const candidates = data?.candidates || [];
  const stats = data?.stats || {};

  // Filter candidates locally for responsive search and filter
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchSearch =
        !search ||
        (c.fullName && c.fullName.toLowerCase().includes(search.toLowerCase())) ||
        (c.position && c.position.toLowerCase().includes(search.toLowerCase())) ||
        (c.mobile && c.mobile.includes(search)) ||
        (c.city && c.city.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' || (c.status || 'new').toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [candidates, search, statusFilter]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCandidates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCandidates.map((c) => c._id)));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Export handlers
  const handleExportCSV = (onlySelected = false) => {
    let target = candidates;
    if (onlySelected && selectedIds.size > 0) {
      target = candidates.filter((c) => selectedIds.has(c._id));
    } else if (filteredCandidates.length > 0 && search) {
      target = filteredCandidates;
    }

    const schoolLabel = (school?.schoolName || 'school').replace(/[^a-zA-Z0-9]/g, '_');
    exportCandidatesToCSV(
      target.map((c) => ({ ...c, schoolName: school?.schoolName })),
      `${schoolLabel}_candidates_${onlySelected ? 'selected' : 'all'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handlePrintPDF = (onlySelected = false) => {
    let target = candidates;
    if (onlySelected && selectedIds.size > 0) {
      target = candidates.filter((c) => selectedIds.has(c._id));
    } else if (filteredCandidates.length > 0 && search) {
      target = filteredCandidates;
    }

    printCandidatesReport(
      target.map((c) => ({ ...c, schoolName: school?.schoolName })),
      `${school?.schoolName || 'School'} - Candidates Roster Report`,
      school
    );
  };

  // Stealth login into school
  const handleStealthLogin = async () => {
    if (!school?._id) return;
    try {
      setIsImpersonating(true);
      const res = await impersonateSchool(school._id);
      if (res.data?.success) {
        await impersonate(res.data);
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to login as school:', err);
      alert(err.response?.data?.message || 'Failed to enter stealth session');
    } finally {
      setIsImpersonating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 text-indigo-300">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {school?.schoolName || 'School Profile & Candidate Roster'}
                </h2>
                {school && (
                  <Badge className={cn(
                    "text-[10px] font-bold uppercase rounded-md shadow-none",
                    school.isActive !== false ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  )}>
                    {school.isActive !== false ? 'Active' : 'Suspended'}
                  </Badge>
                )}
                {school?.subscriptionPlan && (
                  <Badge variant="outline" className="text-[10px] font-bold text-purple-300 border-purple-500/40 bg-purple-500/10 uppercase">
                    Plan: {school.subscriptionPlan}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Full institutional summary, supervisor credentials, and linked candidate profiles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {school && (
              <Button
                size="sm"
                onClick={handleStealthLogin}
                disabled={isImpersonating}
                className="h-8.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Login directly into this school's portal in Stealth Mode"
              >
                {isImpersonating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogIn className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Login as School</span>
              </Button>
            )}
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 text-[#8A3BD4] animate-spin" />
              <span className="text-xs font-bold text-slate-500">Retrieving full school metrics and candidates...</span>
            </div>
          ) : isError || !school ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <p className="font-bold text-sm text-rose-500">Failed to load school details.</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
          ) : (
            <>
              {/* Institutional Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* School Contact Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Institutional Details
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{school.email}</span>
                    </div>
                    {school.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{school.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight text-slate-500">
                        {[school.address, school.city, school.state, school.pincode].filter(Boolean).join(', ') || 'No address provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supervisor / School Admin Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Assigned Administrator
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <div className="font-bold text-slate-800 dark:text-white">
                      {admin?.name || 'Administrator'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{admin?.email || school.email}</span>
                    </div>
                    {(admin?.phone || admin?.mobile) && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{admin?.phone || admin?.mobile}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan & Subscription Box */}
                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/50 space-y-2">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                    Subscription & Credits
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Current Plan:</span>
                      <strong className="text-[#8A3BD4] uppercase">{school.subscriptionPlan || 'Basic'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Credit Balance:</span>
                      <strong className="text-amber-700 dark:text-amber-400 font-black">{school.credits || 0} Credits</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Valid Till:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {school.expiryDate ? formatDate(school.expiryDate) : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Influx Stat Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 dark:bg-slate-800 border border-indigo-200/80 dark:border-indigo-900/50 space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                    Total Candidates Linked
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white">
                      {candidates.length}
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">profiles</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {stats.hired || 0} Hired
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {stats.shortlisted || 0} Shortlisted
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {stats.interviewScheduled || 0} Interview
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── CANDIDATES SECTION ─── */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                {/* Search, Filter & Bulk Export Toolbar */}
                <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        placeholder="Search candidate by name, role, city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 h-9 text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <option value="all">All Statuses ({candidates.length})</option>
                      <option value="new">New</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {selectedIds.size > 0 && (
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300 mr-1 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-200">
                        {selectedIds.size} Selected
                      </span>
                    )}

                    {/* Excel CSV Export */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportCSV(selectedIds.size > 0)}
                      disabled={candidates.length === 0}
                      className="h-8.5 rounded-lg px-2.5 text-xs font-bold border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer flex items-center gap-1.5"
                      title={selectedIds.size > 0 ? "Download selected candidates in Excel format" : "Download all candidates of this school in Excel"}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{selectedIds.size > 0 ? `Excel (${selectedIds.size})` : 'Export Excel'}</span>
                    </Button>

                    {/* PDF Print Export */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePrintPDF(selectedIds.size > 0)}
                      disabled={candidates.length === 0}
                      className="h-8.5 rounded-lg px-2.5 text-xs font-bold border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 cursor-pointer flex items-center gap-1.5"
                      title={selectedIds.size > 0 ? "Print / Save PDF for selected candidates" : "Print / Save PDF for all candidates of this school"}
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>{selectedIds.size > 0 ? `PDF (${selectedIds.size})` : 'Export PDF'}</span>
                    </Button>
                  </div>
                </div>

                {/* Candidates Table */}
                <div className="overflow-x-auto max-h-[380px]">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-50/90 dark:bg-slate-800/90 sticky top-0 z-10 border-b">
                      <TableRow>
                        <TableHead className="w-10 px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                            title="Select / Unselect All"
                          >
                            {selectedIds.size > 0 && selectedIds.size === filteredCandidates.length ? (
                              <CheckSquare className="h-4 w-4 text-[#8A3BD4]" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-slate-600">Candidate Name</TableHead>
                        <TableHead className="text-xs font-bold text-slate-600">Role / Position</TableHead>
                        <TableHead className="text-xs font-bold text-slate-600">Contact</TableHead>
                        <TableHead className="text-xs font-bold text-slate-600">Experience</TableHead>
                        <TableHead className="text-xs font-bold text-slate-600">Status</TableHead>
                        <TableHead className="text-xs font-bold text-slate-600">Location</TableHead>
                        <TableHead className="text-xs font-bold text-slate-600 text-right pr-4">Applied Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                            {search || statusFilter !== 'all'
                              ? 'No candidates match your filter criteria.'
                              : 'No candidates registered or linked to this school yet.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCandidates.map((candidate) => {
                          const isSelected = selectedIds.has(candidate._id);
                          return (
                            <TableRow
                              key={candidate._id}
                              className={cn(
                                "hover:bg-purple-50/30 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-xs",
                                isSelected && "bg-purple-50/60 dark:bg-purple-950/20"
                              )}
                              onClick={() => toggleSelectOne(candidate._id)}
                            >
                              <TableCell className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => toggleSelectOne(candidate._id)}
                                  className="p-1 rounded cursor-pointer"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="h-4 w-4 text-[#8A3BD4]" />
                                  ) : (
                                    <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="font-bold text-slate-900 dark:text-white py-2">
                                <div>{candidate.fullName}</div>
                                {candidate.email && (
                                  <div className="text-[11px] font-normal text-slate-400">{candidate.email}</div>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[10px]">
                                  {candidate.position}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                {candidate.mobile}
                              </TableCell>
                              <TableCell className="py-2 text-slate-600 dark:text-slate-300">
                                {candidate.experienceYears ?? 0} yrs
                              </TableCell>
                              <TableCell className="py-2">
                                <Badge
                                  className={cn(
                                    "text-[9px] font-bold px-2 py-0.5 rounded shadow-none uppercase",
                                    candidate.status === 'hired'
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                      : candidate.status === 'shortlisted'
                                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                                      : candidate.status === 'interview_scheduled'
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  )}
                                >
                                  {candidate.status || 'new'}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2 text-slate-500 text-[11px]">
                                {[candidate.city, candidate.state].filter(Boolean).join(', ') || '-'}
                              </TableCell>
                              <TableCell className="py-2 text-slate-400 text-right pr-4 text-[11px]">
                                {candidate.createdAt ? formatDate(candidate.createdAt) : '-'}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {filteredCandidates.length} candidate(s) loaded
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8.5 rounded-lg px-4 text-xs font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
