import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Shield, Coins, Layers, Mail, Phone, RefreshCcw, CheckCircle, XCircle, Award } from 'lucide-react';
import { getAdmins, getPlans, assignCreditsToSchool } from '@/lib/api';
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
    <div className="space-y-6 p-6 max-w-7xl mx-auto antialiased bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Upper Header Frame */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5 dark:border-slate-800">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Admins Management
        </h1>
        {isFetching && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 animate-spin">
            <RefreshCcw className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Modern Filter Panel */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="relative max-w-md group">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Search schools, administrators, or domains..."
              className="pl-10 h-11 bg-slate-50/60 border-slate-200 rounded-xl font-medium focus:bg-white transition-all text-sm"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Administrative Table Matrix with Color Adapting Rows */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs rounded-xl overflow-hidden mt-2">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/50">
                <TableRow>
                  <TableHead className="pl-6 font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">School Profile</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Administrator</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Contact Identity</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">System Status</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Balance</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Active License Tier</TableHead>
                  <TableHead className="pr-6 text-right font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 mb-3 shadow-2xs">
                          <RefreshCcw className="h-4 w-4 text-indigo-600 animate-spin" />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 tracking-wide animate-pulse">
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
                          "group transition-all duration-200 last:border-0 animate-in fade-in slide-in-from-left-2",
                          admin.isActive 
                            ? "bg-emerald-50/40 hover:bg-emerald-50 dark:bg-emerald-950/10" 
                            : "bg-slate-50/50 hover:bg-slate-50/90 dark:bg-slate-900/20"
                        )}
                      >
                        {/* School Profile Avatar initial */}
                        <TableCell className="pl-6 py-3.5 font-bold text-slate-700 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              {admin.schoolName ? admin.schoolName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <span className="truncate max-w-[180px] block tracking-tight group-hover:text-indigo-600 transition-colors">{admin.schoolName}</span>
                          </div>
                        </TableCell>

                        {/* Admin Name Details */}
                        <TableCell className="py-3.5 text-slate-700 font-bold text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            <span>{admin.adminName}</span>
                          </div>
                        </TableCell>

                        {/* Contact Identity Stack */}
                        <TableCell className="py-3.5">
                          <div className="flex flex-col space-y-0.5 max-w-[190px]">
                            <span className="text-xs font-bold text-slate-600 truncate flex items-center gap-1.5">
                              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                              {admin.email}
                            </span>
                            {admin.mobile ? (
                              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
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
                              "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md inline-flex items-center gap-1 bg-white shadow-2xs",
                              admin.isActive ? "text-emerald-700 border-emerald-200" : "text-slate-400 border-slate-200"
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

                        {/* Coin Credits Available Token Balance */}
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                            <Coins className={cn("h-3.5 w-3.5", admin.credits > 0 ? "text-amber-500" : "text-slate-300")} />
                            <span>{admin.credits}</span>
                          </div>
                        </TableCell>

                        {/* Active Licensing Subscription Tier */}
                        <TableCell className="py-3.5">
                          {admin.plan?.name ? (
                            <Badge variant="outline" className="px-2.5 py-0.5 bg-white border-purple-200 text-purple-700 font-bold text-[11px] rounded-md shadow-2xs inline-flex items-center gap-1">
                              <Award className="h-3 w-3 text-purple-500" />
                              {admin.plan.name}
                            </Badge>
                          ) : (
                            <span className="text-xs font-semibold text-slate-300 italic">No assigned tier</span>
                          )}
                        </TableCell>

                        {/* Operations Assign trigger box */}
                        <TableCell className="pr-6 py-3.5 text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setAssignDialog(admin)}
                            className="h-8 rounded-lg px-3 text-xs font-bold border-slate-200 text-slate-700 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-2xs transition-all duration-200 active:scale-95 group-hover:border-indigo-200"
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3 shadow-2xs">
                          <Shield className="h-4 w-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-700">No school administrators found</h4>
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
        <DialogContent className="max-w-md border-slate-200 bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200 font-sans">
          <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
            <DialogTitle className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" />
              Resource Distribution
            </DialogTitle>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Modifying workspace access parameters for <span className="font-extrabold text-indigo-600">{assignDialog?.schoolName}</span>
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subscription Tier</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:bg-white text-xs transition-all">
                  <SelectValue placeholder="Retain current tier or select package" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 bg-white shadow-2xl p-1">
                  {plans.map((p) => (
                    <SelectItem 
                      key={p._id} 
                      value={p._id}
                      className="rounded-lg py-2 text-slate-600 focus:bg-gradient-to-r focus:from-indigo-50 focus:to-blue-50 focus:text-indigo-600 font-semibold text-xs"
                    >
                      {p.name} — <span className="text-indigo-600 font-bold">{p.credits} cr</span> / <span className="text-slate-400 font-normal">{p.durationDays} days</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Action Topup Credits</Label>
              <div className="relative group">
                <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="number"
                  placeholder="Enter manual credit quantity (e.g. 500)"
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl font-semibold focus:bg-white text-xs"
                  value={extraCredits}
                  onChange={(e) => setExtraCredits(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAssign} 
              disabled={assignMutation.isPending}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs tracking-wider shadow-md shadow-indigo-500/10 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}