import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Pencil, Trash2, Layers, IndianRupee, Activity, 
  CheckCircle, CreditCard, Sparkles, Loader2, FileCheck2, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';
import { getApplicantPlans, createApplicantPlan, updateApplicantPlan, deleteApplicantPlan } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const emptyForm = { name: '', planType: 'UNLIMITED', price: '', requestCount: '', durationDays: '', features: '' };

export default function ApplicantPlans() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [planError, setPlanError] = useState('');

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['applicant-plans'],
    queryFn: () => getApplicantPlans().then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => (editPlan ? updateApplicantPlan(editPlan._id, data) : createApplicantPlan(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-plans'] });
      setDialogOpen(false);
      setEditPlan(null);
      setForm(emptyForm);
      setPlanError('');
    },
    onError: (err) => {
      setPlanError(err.response?.data?.message || 'Failed to save plan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplicantPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applicant-plans'] }),
  });

  const openCreate = () => {
    setEditPlan(null);
    setForm(emptyForm);
    setPlanError('');
    setDialogOpen(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setPlanError('');
    setForm({
      name: plan.name || '',
      planType: plan.planType || 'UNLIMITED',
      price: String(plan.price ?? ''),
      requestCount: plan.requestCount ? String(plan.requestCount) : '',
      durationDays: plan.durationDays ? String(plan.durationDays) : '',
      features: plan.features?.join('\n') || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      planType: form.planType,
      price: Number(form.price),
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      isActive: editPlan ? editPlan.isActive : true,
    };

    if (form.planType === 'REQUEST_BASED') {
      data.requestCount = Number(form.requestCount);
    } else if (form.planType === 'UNLIMITED') {
      data.durationDays = Number(form.durationDays);
    }

    saveMutation.mutate(data);
  };

  const totalPlans = plans.length;
  const unlimitedCount = plans.filter((p) => p.planType === 'UNLIMITED').length;
  const requestBasedCount = plans.filter((p) => p.planType === 'REQUEST_BASED').length;

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-[#00F5D4] dark:text-emerald-300 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <FileCheck2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Applicant Monetization Plans
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 shrink-0">
                {totalPlans} Pricing Plans
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Configure unlimited and pay-per-request monetization subscriptions for individual applicants
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
            <span>Add Applicant Plan</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. MINI STATS OVERVIEW ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Total Plans
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 dark:text-white mt-1">
              {totalPlans}
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Applicant tiers</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#EFF6FF] via-white to-cyan-50/50 dark:bg-slate-900 border border-cyan-200/80 dark:border-cyan-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              Unlimited Tiers
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {unlimitedCount}
            </h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">Time-based access</p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-100/80 dark:bg-cyan-950/60 text-[#00D2FF] dark:text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/50 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
              Request Based
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-white mt-1">
              {requestBasedCount}
            </h3>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">Pay-per-school contact</p>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <FileCheck2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── 3. PLANS DATA TABLE ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/50 text-[#8A3BD4] rounded-xl border border-purple-200/60">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Applicant Plans Catalog
              </CardTitle>
              <p className="text-[11px] text-slate-500 font-medium">
                Active monetization bundles for job seekers
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-7 w-7 text-[#8A3BD4] animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">Loading applicant plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No applicant plans configured yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Applicant Plan" to configure pricing</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="pl-5 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Plan Name</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Billing Model</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Price (₹)</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Allowance</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Features</TableHead>
                    <TableHead className="pr-5 text-right font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => {
                    const isRequestBased = plan.planType === 'REQUEST_BASED';

                    return (
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
                          <Badge 
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border shadow-none",
                              isRequestBased 
                                ? "border-purple-200 bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300" 
                                : "border-cyan-200 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
                            )}
                          >
                            {isRequestBased ? 'Request Based' : 'Unlimited Tier'}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4 font-black text-slate-900 dark:text-white text-sm">
                          <div className="inline-flex items-center">
                            <IndianRupee className="h-3.5 w-3.5 text-slate-500 mr-0.5" />
                            <span>{plan.price}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 text-xs font-bold text-slate-700 dark:text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-slate-400" />
                            <span>{isRequestBased ? `${plan.requestCount} Direct Requests` : `${plan.durationDays} Days Active`}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1 max-w-[240px]">
                            {plan.features?.slice(0, 2).map((feat, idx) => (
                              <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md">
                                {feat}
                              </span>
                            ))}
                            {plan.features?.length > 2 && (
                              <span className="text-[10px] font-extrabold text-[#8A3BD4] self-center">
                                +{plan.features.length - 2} more
                              </span>
                            )}
                          </div>
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
                                if (window.confirm(`Delete applicant plan "${plan.name}"?`)) {
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── 4. ADD / EDIT PLAN MODAL ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 rounded-lg">
                <CreditCard className="h-4 w-4" />
              </div>
              <span>{editPlan ? 'Modify Applicant Plan' : 'Create Applicant Plan'}</span>
            </DialogTitle>
          </DialogHeader>

          {planError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {planError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Title *</Label>
              <Input
                placeholder="e.g. Basic Starter, Premium Jobseeker"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Model *</Label>
                <Select value={form.planType} onValueChange={(v) => setForm({ ...form, planType: v })}>
                  <SelectTrigger className="h-10 border-slate-200 rounded-xl text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl dark:bg-slate-800">
                    <SelectItem value="UNLIMITED" className="text-xs font-semibold">Unlimited Tier</SelectItem>
                    <SelectItem value="REQUEST_BASED" className="text-xs font-semibold">Request Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price (₹ INR) *</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 199"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="pl-8 h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                    required
                  />
                  <IndianRupee className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {form.planType === 'REQUEST_BASED' ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Direct Request Contacts *</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 5"
                  value={form.requestCount}
                  onChange={(e) => setForm({ ...form, requestCount: e.target.value })}
                  className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  required
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (Days) *</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  className="h-10 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Feature Bullet Points (1 per line)</Label>
              <Textarea
                rows={3}
                placeholder="Direct school WhatsApp sharing&#10;Verified profile badge&#10;Priority listing"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                className="border-slate-200 rounded-xl text-xs font-medium"
              />
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