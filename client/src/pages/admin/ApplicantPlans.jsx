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
    <div className="space-y-6 p-6 max-w-7xl mx-auto antialiased bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Top Action Header Controls (Description Text String Removed) */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5 dark:border-slate-800">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Applicant Plans
        </h1>
        <Button 
          onClick={openCreate}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/10 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-xs h-9 px-4"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[3]" />
          Add Product Plan
        </Button>
      </div>

      {/* Main Administrative Plan Network Matrix Grid */}
      <Card className="border border-slate-200/60 bg-white shadow-2xs rounded-xl overflow-hidden mt-2">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/50">
                <TableRow>
                  <TableHead className="pl-6 font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Plan Name</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Billing Model</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Price Rate</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Metrics Allowance</TableHead>
                  <TableHead className="max-w-xs font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Bundled Feature Provisions</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Lifecycle Status</TableHead>
                  <TableHead className="pr-6 text-right font-bold text-[11px] tracking-wider uppercase text-slate-500 py-3">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-3 shadow-2xs">
                          <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 tracking-wide animate-pulse">
                          Syncing applicant billing profiles...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : plans.length > 0 ? (
                  plans.map((plan, index) => {
                    const isRequestBased = plan.planType === 'REQUEST_BASED';

                    return (
                      <TableRow 
                        key={plan._id}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className={cn(
                          "group transition-all duration-200 last:border-0 animate-in fade-in slide-in-from-left-2",
                          // Soft modern light multi-color backdrops per architecture model status
                          isRequestBased 
                            ? "bg-purple-50/40 hover:bg-purple-50/80 dark:bg-purple-950/10" 
                            : "bg-cyan-50/40 hover:bg-cyan-50/80 dark:bg-cyan-950/10"
                        )}
                      >
                        {/* Plan Profile Title Column */}
                        <TableCell className="pl-6 py-3.5 font-bold text-slate-700 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-indigo-600 font-bold shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              <Layers className="h-4 w-4" />
                            </div>
                            <span className="truncate max-w-[160px] block tracking-tight group-hover:text-indigo-600 transition-colors">{plan.name}</span>
                          </div>
                        </TableCell>

                        {/* Billing Method Target Badge */}
                        <TableCell className="py-3.5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md bg-white shadow-2xs",
                              isRequestBased ? 'text-purple-700 border-purple-200' : 'text-cyan-700 border-cyan-200'
                            )}
                          >
                            {isRequestBased ? 'Request Based' : 'Unlimited Tier'}
                          </Badge>
                        </TableCell>

                        {/* Currency Display Area */}
                        <TableCell className="py-3.5 text-slate-700 font-bold text-sm">
                          <div className="inline-flex items-center bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                            <IndianRupee className="h-3 w-3 text-slate-400 mr-0.5 stroke-[2.5]" />
                            <span>{plan.price}</span>
                          </div>
                        </TableCell>

                        {/* Limits Threshold Metrics */}
                        <TableCell className="py-3.5 text-slate-700 font-bold text-sm">
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-[13px] tracking-tight">
                              {isRequestBased ? `${plan.requestCount} Requests` : `${plan.durationDays} Days Active`}
                            </span>
                          </div>
                        </TableCell>

                        {/* Features List Lines Map */}
                        <TableCell className="max-w-xs py-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[240px]">
                            {plan.features?.slice(0, 2).map((feat, idx) => (
                              <span key={idx} className="inline-block text-[11px] font-semibold text-slate-600 bg-white border border-slate-200/60 px-2 py-0.5 rounded shadow-2xs">
                                {feat}
                              </span>
                            ))}
                            {plan.features?.length > 2 && (
                              <span className="text-[10px] font-bold text-indigo-500 pl-0.5 self-center">+{plan.features.length - 2} more</span>
                            )}
                          </div>
                        </TableCell>

                        {/* Operational Lifecycle Status Badge */}
                        <TableCell className="py-3.5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md inline-flex items-center gap-1 bg-white shadow-2xs",
                              plan.isActive ? 'text-emerald-700 border-emerald-200' : 'text-slate-400 border-slate-200'
                            )}
                          >
                            <div className={cn("h-1.5 w-1.5 rounded-full", plan.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                            {plan.isActive ? 'Active' : 'Archived'}
                          </Badge>
                        </TableCell>

                        {/* Operations Trigger Action Box */}
                        <TableCell className="pr-6 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEdit(plan)}
                              className="h-8 w-8 rounded-lg p-0 border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 shadow-2xs transition-all active:scale-95"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMutation.mutate(plan._id)}
                              disabled={!plan.isActive}
                              className="h-8 w-8 rounded-lg p-0 bg-red-50 text-red-500 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-all active:scale-95"
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3 shadow-2xs">
                          <Layers className="h-4 w-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-700">No applicant subscription tiers defined</h4>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Drawer Configuration Dialog Sheets */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-slate-200 bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200 font-sans max-h-[92vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
            <DialogTitle className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <ListPlus className="h-4 w-4 text-indigo-500" />
              {editPlan ? 'Modify Pricing Tier Configuration' : 'Register New Subscription Model'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Identifier Title</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
                placeholder="e.g. Executive Elite Candidate Package"
                className="h-11 border-slate-200 rounded-xl font-semibold text-slate-700 focus:bg-white text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subscription Allocation Metric</Label>
              <Select value={form.planType} onValueChange={(value) => setForm({ ...form, planType: value })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:bg-white text-xs transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 bg-white shadow-2xl p-1">
                  <SelectItem value="REQUEST_BASED" className="rounded-lg py-2 font-semibold text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50 text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      <span>Request Based Allocation (Token Bucket)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNLIMITED" className="rounded-lg py-2 font-semibold text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-500" />
                      <span>Unlimited Access (Calendar Matrix Engine)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Financial Value Pricing (INR)</Label>
              <div className="relative group">
                <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  placeholder="0 (For completely free onboarding options)"
                  className="pl-10 h-11 border-slate-200 rounded-xl font-semibold focus:bg-white text-xs"
                />
              </div>
            </div>
            
            {form.planType === 'REQUEST_BASED' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-xs font-bold uppercase tracking-wider text-purple-600">Total Profile Token Request Balance Allowance</Label>
                <Input
                  type="number"
                  value={form.requestCount}
                  onChange={(e) => setForm({ ...form, requestCount: e.target.value })}
                  required
                  placeholder="e.g. 50"
                  className="h-11 border-purple-200 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 rounded-xl bg-purple-50/10 focus:bg-white text-xs font-semibold text-purple-900"
                />
              </div>
            )}
            
            {form.planType === 'UNLIMITED' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-xs font-bold uppercase tracking-wider text-cyan-600">License Expiration Lifespan Threshold (Days)</Label>
                <Input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  required
                  placeholder="e.g. 365"
                  className="h-11 border-cyan-200 focus:border-cyan-500/80 focus:ring-4 focus:ring-cyan-500/10 rounded-xl bg-cyan-50/10 focus:bg-white text-xs font-semibold text-cyan-900"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Value Proposition Line Matrix (One item per row line)</Label>
              <Textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4}
                placeholder="View Recruiter Full Verification Profile&#10;Instant Messaging Priority Connect Channel"
                className="rounded-xl border-slate-200 focus:bg-white p-3 font-semibold text-xs text-slate-700"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs tracking-wider shadow-md shadow-indigo-500/10 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
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