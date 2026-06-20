import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Shield, Coins, Layers, Mail, Phone, RefreshCcw, CheckCircle, XCircle, Award } from 'lucide-react';
import { getAdmins, getPlans, assignCreditsToSchool } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function Admins() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [assignDialog, setAssignDialog] = useState(null);
  const [planId, setPlanId] = useState('');
  const [extraCredits, setExtraCredits] = useState('');

  const { data, isLoading, isFetching } = useQuery({
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

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto antialiased bg-[#f3f3f4] dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Upper Header Frame */}
      <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 dark:border-slate-900">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
          Admins Management
        </h1>
        {isFetching && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 animate-spin dark:bg-slate-900 dark:border-slate-800">
            <RefreshCcw className="h-4 w-4 text-[#A05AFF]" />
          </div>
        )}
      </div>

      {/* Modern Filter Panel */}
      <Card className="filter">
        <CardContent className="p-4">
          <div className="relative max-w-md group">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#A05AFF] transition-colors" />
            <Input
              placeholder="Search schools, administrators, or domains..."
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl font-medium focus-visible:ring-[#A05AFF] transition-all text-sm"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Administrative Table Matrix */}
      <Card className="table">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">School Profile</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">Administrator</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">Contact Identity</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">System Status</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">Balance</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">Active License Tier</TableHead>
                  <TableHead className="pr-6 text-right font-bold text-[11px] tracking-wider uppercase text-slate-700 dark:text-slate-300 py-4">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-slate-200 mb-3 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                          <RefreshCcw className="h-4 w-4 text-[#A05AFF] animate-spin" />
                        </div>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">
                          Retrieving school matrix parameters...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.data?.length > 0 ? (
                  data.data.map((admin, index) => {
                    return (
                      <TableRow 
                        key={admin._id}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className={cn(
                          "group transition-all duration-150 border-b border-slate-100 last:border-none dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 animate-in fade-in slide-in-from-left-2",
                          admin.isActive 
                            ? "bg-transparent" 
                            : "bg-slate-50/30 dark:bg-slate-900/40"
                        )}
                      >
                        {/* School Profile Avatar initial */}
                        <TableCell className="pl-6 py-3.5 font-semibold text-slate-700 text-sm dark:text-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#A05AFF] to-[#9E58FF] text-white text-xs font-bold shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              {admin.schoolName ? admin.schoolName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <span className="truncate max-w-[180px] block tracking-tight group-hover:text-[#A05AFF] transition-colors">{admin.schoolName}</span>
                          </div>
                        </TableCell>

                        {/* Admin Name Details */}
                        <TableCell className="py-3.5 text-slate-700 font-semibold text-sm dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#A05AFF] transition-colors" />
                            <span>{admin.adminName}</span>
                          </div>
                        </TableCell>

                        {/* Contact Identity Stack */}
                        <TableCell className="py-3.5">
                          <div className="flex flex-col space-y-0.5 max-w-[190px]">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5">
                              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                              {admin.email}
                            </span>
                            {admin.mobile ? (
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                <Phone className="h-2.5 w-2.5 shrink-0 text-slate-300" />
                                {admin.mobile}
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-300 italic pl-4.5">No phone logs</span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status Active Badge */}
                        <TableCell className="py-3.5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-2 py-0.5 font-medium tracking-wide text-[10px] uppercase rounded-md inline-flex items-center gap-1 bg-transparent border shadow-none",
                              admin.isActive 
                                ? "text-[#1BCFB4] border-[#1BCFB4]/30 bg-[#1BCFB4]/5" 
                                : "text-slate-400 border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-transparent"
                            )}
                          >
                            {admin.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-[#1BCFB4]" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 text-slate-400" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>

                        {/* Coin Credits Available Token Balance */}
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-sm dark:text-slate-200">
                            <Coins className={cn("h-3.5 w-3.5", admin.credits > 0 ? "text-amber-500" : "text-slate-300")} />
                            <span>{admin.credits}</span>
                          </div>
                        </TableCell>

                        {/* Active Licensing Subscription Tier */}
                        <TableCell className="py-3.5">
                          {admin.plan?.name ? (
                            <Badge variant="outline" className="px-2 py-0.5 border-[#9E58FF]/30 bg-[#9E58FF]/5 text-[#9E58FF] font-medium text-[10px] uppercase rounded-md inline-flex items-center gap-1">
                              <Award className="h-3 w-3 text-[#9E58FF]" />
                              {admin.plan.name}
                            </Badge>
                          ) : (
                            <span className="text-xs font-medium text-slate-300 italic">No assigned tier</span>
                          )}
                        </TableCell>

                        {/* Operations Assign trigger box */}
                        <TableCell className="pr-6 py-3.5 text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setAssignDialog(admin)}
                            className="h-8 rounded-lg px-3 text-xs font-bold border-slate-200 text-slate-600 bg-white hover:border-[#A05AFF]/40 hover:bg-[#A05AFF]/5 hover:text-[#A05AFF] shadow-xs active:scale-95 group-hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800"
                          >
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                          <Shield className="h-4 w-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">No school administrators found</h4>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation Action Modal Panel Window */}
      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2 dark:text-white">
              <Layers className="h-4 w-4 text-[#A05AFF]" />
              Resource Distribution
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-400 mt-1">
              Modifying workspace access parameters for <span className="font-bold text-[#A05AFF]">{assignDialog?.schoolName}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subscription Tier</Label>
                <Select value={planId} onValueChange={setPlanId}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-medium text-slate-700 focus:ring-[#A05AFF] text-xs transition-all">
                    <SelectValue placeholder="Retain current tier or select package" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none bg-white shadow-md p-1">
                    {plans.map((p) => (
                      <SelectItem
                        key={p._id}
                        value={p._id}
                        className="rounded-lg py-2 text-slate-600 focus:bg-[#A05AFF]/5 focus:text-[#A05AFF] font-medium text-xs"
                      >
                        {p.name} — <span className="text-[#A05AFF] font-bold">{p.credits} cr</span> / <span className="text-slate-400 font-normal">{p.durationDays} days</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Action Topup Credits</Label>
                <div className="relative group">
                  <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#A05AFF] transition-colors" />
                  <Input
                    type="number"
                    placeholder="Enter manual credit quantity (e.g. 500)"
                    className="pl-10 h-11 bg-white border-slate-200 rounded-xl font-medium focus-visible:ring-[#A05AFF] text-xs"
                    value={extraCredits}
                    onChange={(e) => setExtraCredits(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialog(null)}
              className="rounded-xl h-11 font-medium border-slate-200 text-slate-600 shadow-xs hover:border-[#A05AFF]/40 hover:bg-[#A05AFF]/5 hover:text-[#A05AFF]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={assignMutation.isPending}
              className="rounded-xl h-11 bg-gradient-to-r from-[#A05AFF] via-[#9E58FF] to-[#4BCBEB] hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-md shadow-[#A05AFF]/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 border-none flex items-center justify-center gap-2"
            >
              {assignMutation.isPending ? (
                <>
                  <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                  Updating Ledger...
                </>
              ) : (
                "Commit Configuration Allocation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}