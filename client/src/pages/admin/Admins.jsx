import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, Shield, Coins, Layers, Mail, Phone, RefreshCcw, 
  CheckCircle, XCircle, Award, ShieldAlert, Sparkles, Building2,
  ChevronLeft, ChevronRight, AlertCircle, Plus, LogIn, Loader2, Eye
} from 'lucide-react';
import { getAdmins, getPlans, assignCreditsToSchool, impersonateSchool } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { SchoolDetailsModal } from '@/components/admin/SchoolDetailsModal';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogBody, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function Admins() {
  const navigate = useNavigate();
  const { impersonate } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [assignDialog, setAssignDialog] = useState(null);
  const [planId, setPlanId] = useState('');
  const [extraCredits, setExtraCredits] = useState('');
  const [impersonatingId, setImpersonatingId] = useState(null);
  const [viewSchoolId, setViewSchoolId] = useState(null);

  const handleImpersonate = async (schoolId) => {
    try {
      setImpersonatingId(schoolId);
      const res = await impersonateSchool(schoolId);
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
    queryKey: ['admins', page, search],
    queryFn: () => getAdmins({ page, limit: 10, search }).then((r) => r.data),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getPlans().then((r) => r.data.data),
  });

  const assignMutation = useMutation({
    mutationFn: assignCreditsToSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setAssignDialog(null);
      setPlanId('');
      setExtraCredits('');
    },
  });

  const handleAssign = () => {
    assignMutation.mutate({
      schoolId: assignDialog._id,
      planId: planId || undefined,
      credits: extraCredits ? Number(extraCredits) : undefined,
    });
  };

  const adminsList = data?.data || [];
  const totalCount = data?.pagination?.total || adminsList.length || 0;
  const totalPages = data?.pagination?.pages || Math.ceil(totalCount / 10) || 1;

  const totalCreditsAllocated = adminsList.reduce((acc, curr) => acc + (Number(curr.credits) || 0), 0);
  const activeAdmins = adminsList.filter((a) => a.isActive !== false).length;

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                School Admins & Balance Governance
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 shrink-0">
                {totalCount} School Admins
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Supervise institution administrator credentials, active tokens balance & plan assignments
            </p>
          </div>
        </div>
        
        {/* Quick Refresh */}
        <div className="flex items-center gap-2">
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
              isFetching && "animate-spin text-rose-600"
            )} />
          </Button>
        </div>
      </div>

      {/* ─── 2. MINI STATS OVERVIEW ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FFF1F2] via-white to-rose-50/50 dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
              Total Admins
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-white mt-1">
              {totalCount}
            </h3>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">Supervised school accounts</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
              Active Access
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-white mt-1">
              {activeAdmins}
            </h3>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">Fully operational accounts</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FFFBEB] via-white to-amber-50/50 dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Page Credits Sum
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-white mt-1">
              {totalCreditsAllocated.toLocaleString()}
            </h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">Credits distributed</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 3. SEARCH TOOLBAR ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl">
        <CardContent className="p-3 sm:p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by school, administrator, or email..."
              className="pl-10 h-10 border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus-visible:ring-rose-400"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ─── 4. ADMINS TABLE ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <RefreshCcw className="h-7 w-7 text-rose-600 animate-spin" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading school administrators...</span>
              </div>
            </div>
          ) : !adminsList || adminsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-slate-800 text-rose-600 mb-3">
                <AlertCircle className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No Matching Admins</h4>
              <p className="text-xs text-slate-400 mt-1">
                No school administrator records matched your search parameters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="pl-5 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">School Identity</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Administrator</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Contact Email / Phone</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Status</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Credits Balance</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Active Plan Tier</TableHead>
                    <TableHead className="pr-5 text-right font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Resource Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminsList.map((admin) => (
                    <TableRow 
                      key={admin._id}
                      className="group hover:bg-rose-50/20 dark:hover:bg-slate-800/40 transition-all border-b border-slate-100 dark:border-slate-800/60 last:border-none"
                    >
                      {/* School Name & Avatar */}
                      <TableCell className="pl-5 py-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300 font-extrabold text-xs shadow-2xs">
                            {admin.schoolName ? admin.schoolName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <span className="truncate max-w-[180px] sm:max-w-[220px] font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-[#8A3BD4] transition-colors">
                            {admin.schoolName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Admin Name */}
                      <TableCell className="py-4 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          <span>{admin.adminName}</span>
                        </div>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell className="py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{admin.email}</span>
                          </div>
                          {admin.mobile && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{admin.mobile}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        {admin.isActive !== false ? (
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

                      {/* Credits Balance */}
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 font-extrabold text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/70">
                          <Coins className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span>{admin.credits ?? 0} Credits</span>
                        </div>
                      </TableCell>

                      {/* Active Plan */}
                      <TableCell className="py-4">
                        {admin.plan?.name ? (
                          <Badge variant="outline" className="px-2.5 py-0.5 border-purple-200/80 bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 font-bold text-[10px] uppercase rounded-lg inline-flex items-center gap-1 shadow-none">
                            <Award className="h-3 w-3 text-[#8A3BD4]" />
                            {admin.plan.name}
                          </Badge>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">Default Tier</span>
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="pr-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setViewSchoolId(admin._id)}
                            className="h-8 w-8 rounded-lg border-indigo-200/90 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer"
                            title="View School Profile, Candidates & Export"
                          >
                            <Eye className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleImpersonate(admin._id)}
                            disabled={impersonatingId === admin._id}
                            className="h-8 w-8 rounded-lg border-amber-200/90 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer"
                            title="Stealth Login as this School (Zero notifications or alerts sent)"
                          >
                            {impersonatingId === admin._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" />
                            ) : (
                              <LogIn className="h-3.5 w-3.5 text-amber-600" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setAssignDialog(admin)}
                            className="h-8 rounded-lg px-3 text-xs font-bold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:text-[#8A3BD4] hover:border-[#8A3BD4]/40 hover:bg-purple-50/50 transition-all cursor-pointer"
                          >
                            <Coins className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                            Assign Credits
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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

      {/* ─── 5. ALLOCATE CREDITS & PLAN DIALOG ─── */}
      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 rounded-lg">
                <Coins className="h-4 w-4" />
              </div>
              <span>Allocate Credits & Subscription</span>
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Top up credit balance or update plan tier for <span className="font-extrabold text-slate-900 dark:text-white">{assignDialog?.schoolName}</span>
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-xs flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-medium">Current Balance</p>
                <p className="text-base font-black text-[#8A3BD4] mt-0.5">{assignDialog?.credits || 0} Credits</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Administrator</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{assignDialog?.adminName}</p>
              </div>
            </div>

            {/* Plan Tier Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assign Subscription Plan</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger className="h-10 border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold">
                  <SelectValue placeholder="Keep Current Plan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl dark:bg-slate-800">
                  <SelectItem value="" className="text-xs font-semibold">No Change / Keep Current</SelectItem>
                  {plans.map((p) => (
                    <SelectItem key={p._id} value={p._id} className="text-xs font-semibold">
                      {p.name} ({p.credits} credits, {p.durationDays} days)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Extra Credits Top-up */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Extra Credits</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={extraCredits}
                  onChange={(e) => setExtraCredits(e.target.value)}
                  className="pl-9 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                />
                <Coins className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
              </div>
              <p className="text-[10.5px] text-slate-400 font-medium">This will be added on top of existing balance.</p>
            </div>
          </DialogBody>

          <DialogFooter className="mt-5 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setAssignDialog(null)}
              className="rounded-xl h-10 px-4 font-bold text-xs border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={assignMutation.isPending || (!planId && !extraCredits)}
              className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold rounded-xl h-10 px-5 text-xs shadow-sm cursor-pointer"
            >
              {assignMutation.isPending ? 'Allocating...' : 'Allocate Resources'}
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