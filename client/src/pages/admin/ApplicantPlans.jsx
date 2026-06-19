import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Layers, IndianRupee, Activity, CheckCircle, ListPlus, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { getApplicantPlans, createApplicantPlan, updateApplicantPlan, deleteApplicantPlan } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to save plan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplicantPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applicant-plans'] }),
  });

  const openCreate = () => {
    setEditPlan(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      planType: plan.planType,
      price: String(plan.price),
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

  return (
    <div className="p-6 max-w-7xl mx-auto antialiased bg-slate-50/50 dark:bg-slate-950 min-h-screen space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header Panel */}
      <div className="flex items-center justify-between pb-5">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
          Applicant Plans
        </h1>
        <Button 
          onClick={openCreate}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 text-xs h-9 px-4"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[3]" />
          Add Product Plan
        </Button>
      </div>

      {/* Main Container Layer */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-5">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-900/20 border-b border-slate-200/60 dark:border-slate-800">
                <TableRow className="border-none">
                  <TableHead className="pl-4 font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Plan Name</TableHead>
                  <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Billing Model</TableHead>
                  <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Price Rate</TableHead>
                  <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Metrics Allowance</TableHead>
                  <TableHead className="max-w-xs font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Bundled Feature Provisions</TableHead>
                  <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Lifecycle Status</TableHead>
                  <TableHead className="pr-4 text-right font-semibold text-[11px] uppercase tracking-wider text-slate-500 py-3 h-auto">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-3 dark:bg-slate-800 dark:border-slate-700">
                          <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
                          Syncing applicant billing profiles...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : plans.length > 0 ? (
                  plans.map((plan) => {
                    const isRequestBased = plan.planType === 'REQUEST_BASED';

                    return (
                      <TableRow 
                        key={plan._id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-100 dark:border-slate-800 last:border-none"
                      >
                        {/* Plan Profile Title */}
                        <TableCell className="pl-4 py-3.5 font-bold text-slate-800 dark:text-slate-200 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                              <Layers className="h-4 w-4" />
                            </div>
                            <span className="truncate max-w-[160px] block tracking-tight">{plan.name}</span>
                          </div>
                        </TableCell>

                        {/* Soft-Tint Billing Badge */}
                        <TableCell className="py-3.5">
                          <span 
                            className={cn(
                              "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border",
                              isRequestBased 
                                ? "border-purple-200/60 bg-purple-50/80 text-purple-700" 
                                : "border-cyan-200/60 bg-cyan-50/80 text-cyan-700"
                            )}
                          >
                            {isRequestBased ? 'Request Based' : 'Unlimited Tier'}
                          </span>
                        </TableCell>

                        {/* Pricing Area */}
                        <TableCell className="py-3.5 text-slate-800 dark:text-slate-200 font-bold text-sm">
                          <div className="inline-flex items-center">
                            <IndianRupee className="h-3 w-3 text-slate-400 mr-0.5 stroke-[2.5]" />
                            <span>{plan.price}</span>
                          </div>
                        </TableCell>

                        {/* Threshold Metrics */}
                        <TableCell className="py-3.5 text-slate-800 dark:text-slate-200 font-bold text-sm">
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm tracking-tight font-medium">
                              {isRequestBased ? `${plan.requestCount} Requests` : `${plan.durationDays} Days Active`}
                            </span>
                          </div>
                        </TableCell>

                        {/* Features Flags */}
                        <TableCell className="max-w-xs py-3.5">
                          <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                            {plan.features?.slice(0, 2).map((feat, idx) => (
                              <span key={idx} className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                                {feat}
                              </span>
                            ))}
                            {plan.features?.length > 2 && (
                              <span className="text-[11px] font-bold tracking-wider uppercase text-purple-600 self-center pl-0.5">
                                +{plan.features.length - 2} More
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Modern Soft-Tint Status Badges */}
                        <TableCell className="py-3.5">
                          <span 
                            className={cn(
                              "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border inline-flex items-center gap-1.5",
                              plan.isActive 
                                ? "border-emerald-200/60 bg-emerald-50/80 text-emerald-700" 
                                : "border-rose-200/60 bg-rose-50/80 text-rose-700"
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", plan.isActive ? "bg-emerald-500" : "bg-rose-500")} />
                            {plan.isActive ? 'Active' : 'Archived'}
                          </span>
                        </TableCell>

                        {/* Dashboard Operation Buttons */}
                        <TableCell className="pr-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEdit(plan)}
                              className="h-8 w-8 rounded-lg p-0 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(plan._id)}
                              disabled={!plan.isActive}
                              className="h-8 w-8 rounded-lg p-0 bg-rose-50/80 text-rose-600 border border-rose-200/60 hover:bg-rose-600 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3 dark:bg-slate-800 dark:border-slate-700">
                          <Layers className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">No applicant subscription tiers defined</h4>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Configurations Dialog Sheets */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border border-slate-200/60 bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 max-h-[92vh] overflow-y-auto">
          <DialogHeader className="pb-4 mb-4 border-b border-slate-200/60 dark:border-slate-800">
            <DialogTitle className="text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <ListPlus className="h-4 w-4 text-purple-600" />
              {editPlan ? 'Modify Pricing Tier Configuration' : 'Register New Subscription Model'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Plan Identifier Title</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
                placeholder="e.g. Executive Elite Candidate Package"
                className="h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subscription Allocation Metric</Label>
              <Select value={form.planType} onValueChange={(value) => setForm({ ...form, planType: value })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
                  <SelectItem value="REQUEST_BASED" className="rounded-lg py-2 text-xs text-slate-600 dark:text-slate-300 focus:text-purple-600 focus:bg-purple-50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span>Request Based Allocation (Token Bucket)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNLIMITED" className="rounded-lg py-2 text-xs text-slate-600 dark:text-slate-300 focus:text-purple-600 focus:bg-purple-50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-600" />
                      <span>Unlimited Access (Calendar Matrix Engine)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Financial Value Pricing (INR)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  placeholder="0 (For completely free onboarding options)"
                  className="pl-10 h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs"
                />
              </div>
            </div>
            
            {form.planType === 'REQUEST_BASED' && (
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Total Profile Token Request Balance Allowance</Label>
                <Input
                  type="number"
                  value={form.requestCount}
                  onChange={(e) => setForm({ ...form, requestCount: e.target.value })}
                  required
                  placeholder="e.g. 50"
                  className="h-11 border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            )}
            
            {form.planType === 'UNLIMITED' && (
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">License Expiration Lifespan Threshold (Days)</Label>
                <Input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  required
                  placeholder="e.g. 365"
                  className="h-11 border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Value Proposition Line Matrix (One item per row line)</Label>
              <Textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4}
                placeholder="View Recruiter Full Verification Profile&#10;Instant Messaging Priority Connect Channel"
                className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Synchronizing Plan Architecture...
                </>
              ) : (
                "Save Configuration Model"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}