import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Shield, Coins, Layers, Mail, Phone, RefreshCcw, CheckCircle, XCircle, Award } from 'lucide-react';
import { getAdmins, getPlans, assignCreditsToSchool } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Visual Header Block with Embedded Network Indicators */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <PageHeader 
          title="Admins" 
          description="Manage and audit all active registered institutions, assign core cloud product tier plans, and distribute service credits." 
        />
      </div>

      {/* Modern Filter Floating Panel */}
      <Card className="border border-slate-100/80 bg-white/70 backdrop-blur-md shadow-xl shadow-slate-100/30 rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="relative max-w-md group">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Search schools, administrators, or domains..."
              className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white transition-all"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Administrative Network Grid Card */}
      <Card className="border border-slate-100/80 bg-white/90 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 border-b border-slate-100">
              <TableRow>
                <TableHead className="pl-6 py-4">School Profile</TableHead>
                <TableHead>Administrator</TableHead>
                <TableHead>Contact Identity</TableHead>
                <TableHead>System Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Active License Tier</TableHead>
                <TableHead className="pr-6 text-right">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-3 shadow-sm">
                        <RefreshCcw className="h-5 w-5 text-indigo-600 animate-spin" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">
                        Retrieving school matrix parameters...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.data?.length > 0 ? (
                data.data.map((admin) => (
                  <TableRow 
                    key={admin._id}
                    className="group border-b border-slate-100/70 last:border-0 hover:bg-gradient-to-r hover:from-indigo-50/20 hover:to-transparent transition-all duration-150"
                  >
                    {/* School Profile Initial Matrix */}
                    <TableCell className="pl-6 py-4.5 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/30 text-indigo-600 font-bold text-sm group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-indigo-500/10 transition-all duration-200">
                          {admin.schoolName ? admin.schoolName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <span className="truncate max-w-[180px] block">{admin.schoolName}</span>
                      </div>
                    </TableCell>

                    {/* Admin Name Column */}
                    <TableCell className="py-4.5 text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                        <span>{admin.adminName}</span>
                      </div>
                    </TableCell>

                    {/* Contact Detail Stack */}
                    <TableCell className="py-4.5">
                      <div className="flex flex-col space-y-1 max-w-[190px]">
                        <span className="text-xs font-semibold text-slate-600 truncate flex items-center gap-1">
                          <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                          {admin.email}
                        </span>
                        {admin.mobile ? (
                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5 shrink-0 text-slate-300" />
                            {admin.mobile}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-300 italic pl-3.5">No contact record</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Toggle Badges */}
                    <TableCell className="py-4.5">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md inline-flex items-center gap-1 shadow-sm/5",
                          admin.isActive 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100/80" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        )}
                      >
                        {admin.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
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

                    {/* Current Available Balance */}
                    <TableCell className="py-4.5">
                      <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                        <Coins className={cn("h-4 w-4", admin.credits > 0 ? "text-amber-500" : "text-slate-300")} />
                        <span>{admin.credits}</span>
                      </div>
                    </TableCell>

                    {/* License Tier */}
                    <TableCell className="py-4.5">
                      {admin.plan?.name ? (
                        <Badge variant="outline" className="px-2.5 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 border-indigo-100/60 text-indigo-700 font-bold text-xs rounded-lg shadow-sm/5 inline-flex items-center gap-1">
                          <Award className="h-3 w-3 text-indigo-500" />
                          {admin.plan.name}
                        </Badge>
                      ) : (
                        <span className="text-xs font-semibold text-slate-300 italic">No assigned tier</span>
                      )}
                    </TableCell>

                    {/* Action Operations Link */}
                    <TableCell className="pr-6 py-4.5 text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setAssignDialog(admin)}
                        className="h-8 rounded-lg px-3 text-xs font-bold border-indigo-100 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm/5 transition-all duration-200 active:scale-95"
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700">No school administrators found</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        There are no enterprise admin profiles mapped to your current filter index criteria. Add or invite accounts to begin.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Premium Multi-Allocation Action Modal Window */}
      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent className="max-w-md border-slate-100 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader className="border-b border-slate-50 pb-4 mb-5">
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              Resource Distribution Panel
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Modifying workspace access parameters for <span className="font-bold text-indigo-600">{assignDialog?.schoolName}</span>.
            </p>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* License Plan Tier Target Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Subscription Plan</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-sm font-medium text-slate-700 transition-all">
                  <SelectValue placeholder="Retain current tier or select package" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 bg-white shadow-2xl p-1.5">
                  {plans.map((p) => (
                    <SelectItem 
                      key={p._id} 
                      value={p._id}
                      className="rounded-lg py-2.5 text-slate-600 focus:bg-gradient-to-r focus:from-indigo-50 focus:to-blue-50 focus:text-indigo-600 font-medium"
                    >
                      {p.name} — <span className="text-indigo-600 font-bold">{p.credits} cr</span> / <span className="text-slate-400 font-normal">{p.durationDays} days</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Custom Manual Token Topup Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Extra Action Credits</Label>
              <div className="relative group">
                <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="number"
                  placeholder="Enter manual credit quantity (e.g. 500)"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white text-sm font-medium"
                  value={extraCredits}
                  onChange={(e) => setExtraCredits(e.target.value)}
                />
              </div>
            </div>
            
            {/* Commit Changes Triggers Container */}
            <Button 
              onClick={handleAssign} 
              disabled={assignMutation.isPending}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide shadow-md shadow-indigo-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {assignMutation.isPending ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Updating Ledger...
                </>
              ) : (
                "Commit Configuration Allocation"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}