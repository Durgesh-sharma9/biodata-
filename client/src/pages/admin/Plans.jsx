import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Pencil, Trash2, Coins, Calendar, Sparkles, Layers, 
  CheckCircle2, AlertCircle, Loader2, ShieldCheck, ArrowRight, Award
} from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, DialogBody, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const emptyForm = { name: '', credits: '', durationDays: '' };

export default function Plans() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getPlans().then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => (editPlan ? updatePlan(editPlan._id, data) : createPlan(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setDialogOpen(false);
      setEditPlan(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  const openCreate = () => { 
    setEditPlan(null); 
    setForm(emptyForm); 
    setDialogOpen(true); 
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({ 
      name: plan.name || '', 
      credits: String(plan.credits || ''), 
      durationDays: String(plan.durationDays || '') 
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({ 
      name: form.name, 
      credits: Number(form.credits), 
      durationDays: Number(form.durationDays) 
    });
  };

  const totalPlans = plans.length;
  const avgCredits = totalPlans > 0 ? Math.round(plans.reduce((s, p) => s + (p.credits || 0), 0) / totalPlans) : 0;
  const maxDays = totalPlans > 0 ? Math.max(...plans.map((p) => p.durationDays || 0)) : 0;

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                School Subscription Plans
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 shrink-0">
                {totalPlans} Active Plans
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Define token quota bundles, validity durations, and licensing packages for institutions
            </p>
          </div>
        </div>
        
        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={openCreate}
            className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Plan</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. MINI STATS OVERVIEW ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FFFBEB] via-white to-amber-50/50 dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Total Plans
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-white mt-1">
              {totalPlans}
            </h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">Configured pricing tiers</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Avg Credits
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 dark:text-white mt-1">
              {avgCredits}
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Credits per package</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
              Max Validity
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-white mt-1">
              {maxDays} Days
            </h3>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">Longest duration tier</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 3. VISUAL PLAN TIERS CARDS GRID ─── */}
      {!isLoading && plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {plans.map((p, idx) => (
            <div 
              key={p._id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-[#8A3BD4]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/80 text-[10.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg shadow-none">
                    Tier {idx + 1}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => openEdit(p)}
                      className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 hover:text-[#8A3BD4] hover:bg-purple-50"
                      title="Edit Plan"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => {
                        if (window.confirm(`Delete plan "${p.name}"?`)) {
                          deleteMutation.mutate(p._id);
                        }
                      }}
                      className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-3 group-hover:text-[#8A3BD4] transition-colors">
                  {p.name}
                </h3>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-amber-500" /> Included Credits
                    </span>
                    <span className="font-black text-amber-800 dark:text-amber-300">{p.credits} Credits</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" /> Plan Validity
                    </span>
                    <span className="font-black text-teal-800 dark:text-teal-300">{p.durationDays} Days</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Active Tier
                </span>
                <span>ID: {p._id.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── 4. PLANS DATA TABLE ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/50 text-[#8A3BD4] rounded-xl border border-purple-200/60">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                All Available Subscription Tiers
              </CardTitle>
              <p className="text-[11px] text-slate-500 font-medium">
                Complete catalog of institution packages
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-7 w-7 text-[#8A3BD4] animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">Loading subscription plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No subscription plans defined yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add New Plan" to configure school tiers</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="pl-5 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Package Name</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Included Credits</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Validity Duration</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Status</TableHead>
                    <TableHead className="pr-5 text-right font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow 
                      key={plan._id}
                      className="group hover:bg-purple-50/20 dark:hover:bg-slate-800/40 transition-all border-b border-slate-100 dark:border-slate-800/60 last:border-none"
                    >
                      <TableCell className="pl-5 py-4 font-extrabold text-sm text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#8A3BD4] flex items-center justify-center font-black text-xs">
                            {plan.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{plan.name}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold border border-amber-200/80 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-lg">
                          <Coins className="h-3.5 w-3.5 text-amber-500"/> 
                          <span>{plan.credits} Credits</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold border border-teal-200/80 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 px-2.5 py-1 rounded-lg">
                          <Calendar className="h-3.5 w-3.5 text-teal-600"/> 
                          <span>{plan.durationDays} Days</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/80 font-bold text-[10px] tracking-wide shadow-none">
                          Active
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="pr-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEdit(plan)} 
                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-[#8A3BD4] hover:bg-purple-50 transition-all cursor-pointer"
                            title="Edit Plan"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => {
                              if (window.confirm(`Delete plan "${plan.name}"?`)) {
                                deleteMutation.mutate(plan._id);
                              }
                            }} 
                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete Plan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── 5. ADD / EDIT PLAN MODAL ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-950/60 text-[#8A3BD4] rounded-lg">
                <Layers className="h-4 w-4" />
              </div>
              <span>{editPlan ? 'Modify Subscription Plan' : 'Create New Subscription Plan'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Display Name *</Label>
              <Input
                placeholder="e.g. Standard Growth, Premium Annual"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Allocated Credits Token Quota *</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  className="pl-9 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  required
                />
                <Coins className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Validity Duration (Days) *</Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 30, 90, 365"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  className="pl-9 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  required
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-teal-600" />
              </div>
            </div>

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
                disabled={saveMutation.isPending}
                className="bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold rounded-xl h-10 px-5 text-xs shadow-sm cursor-pointer"
              >
                {saveMutation.isPending ? 'Saving...' : editPlan ? 'Update Plan' : 'Save Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}