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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Premium Dashboard Action Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <PageHeader
          title="Applicant Plans"
          description="Design, structure, and configure active feature tier access subscriptions for self-registered system applicants."
        />
        <Button 
          onClick={openCreate}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[3]" />
          Add Product Plan
        </Button>
      </div>

      {/* Main Administrative Product Architecture Grid Card */}
      <Card className="border border-slate-100/80 bg-white/90 shadow-xl shadow-slate-100/40 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 border-b border-slate-100">
              <TableRow>
                <TableHead className="pl-6 py-4">Plan Name</TableHead>
                <TableHead>Billing Model</TableHead>
                <TableHead>Price Rate</TableHead>
                <TableHead>Metrics Allowance</TableHead>
                <TableHead className="max-w-xs">Bundled Feature Provisions</TableHead>
                <TableHead>Lifecycle Status</TableHead>
                <TableHead className="pr-6 text-right">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-3 shadow-sm">
                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">
                        Syncing applicant billing profiles...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : plans.length > 0 ? (
                plans.map((plan) => (
                  <TableRow 
                    key={plan._id}
                    className="group border-b border-slate-100/70 last:border-0 hover:bg-gradient-to-r hover:from-indigo-50/20 hover:to-transparent transition-all duration-150"
                  >
                    {/* Plan Profile Title Column */}
                    <TableCell className="pl-6 py-4.5 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/40 text-indigo-600 font-bold transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                          <Layers className="h-4 w-4" />
                        </div>
                        <span className="truncate max-w-[160px] block font-bold text-slate-800">{plan.name}</span>
                      </div>
                    </TableCell>

                    {/* Billing Method Target Badge */}
                    <TableCell className="py-4.5">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md shadow-sm/5",
                          plan.planType === 'REQUEST_BASED' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100/80' 
                            : 'bg-cyan-50 text-cyan-700 border-cyan-100/80'
                        )}
                      >
                        {plan.planType === 'REQUEST_BASED' ? 'Request Based' : 'Unlimited Tier'}
                      </Badge>
                    </TableCell>

                    {/* Currency Display Area */}
                    <TableCell className="py-4.5 font-extrabold text-slate-800 text-sm">
                      <div className="inline-flex items-center text-slate-900 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <IndianRupee className="h-3.5 w-3.5 text-slate-500 mr-0.5 stroke-[2.5]" />
                        <span>{plan.price}</span>
                      </div>
                    </TableCell>

                    {/* Limits Threshold Metrics */}
                    <TableCell className="py-4.5 text-slate-600 font-semibold text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Activity className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {plan.planType === 'REQUEST_BASED' ? `${plan.requestCount} Requests` : `${plan.durationDays} Days Active`}
                        </span>
                      </div>
                    </TableCell>

                    {/* Features Array Truncated Cloud Token Elements */}
                    <TableCell className="max-w-xs py-4.5">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {plan.features?.slice(0, 3).map((feat, idx) => (
                          <span key={idx} className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {feat}
                          </span>
                        ))}
                        {plan.features?.length > 3 && (
                          <span className="text-[10px] font-bold text-indigo-500 pl-0.5 self-center">+{plan.features.length - 3} more</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Operational Lifecycle Badge */}
                    <TableCell className="py-4.5">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md inline-flex items-center gap-1 shadow-sm/5",
                          plan.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100/80' : 'bg-slate-50 text-slate-400 border-slate-200'
                        )}
                      >
                        <div className={cn("h-1.5 w-1.5 rounded-full", plan.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                        {plan.isActive ? 'Active' : 'Archived'}
                      </Badge>
                    </TableCell>

                    {/* Interactive Operational Operations Column Trigger Links */}
                    <TableCell className="pr-6 py-4.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openEdit(plan)}
                          className="h-8 w-8 rounded-lg p-0 border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-100 shadow-sm/5 transition-all active:scale-95"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(plan._id)}
                          disabled={!plan.isActive}
                          className="h-8 w-8 rounded-lg p-0 bg-red-50 text-red-500 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-30 disabled:pointer-events-none shadow-sm/5 transition-all active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 mb-3">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700">No applicant subscription tiers defined</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Your monetization product catalog space is clean. Create configurations to allow incoming candidate tier registrations.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Premium Product Configuration Sheet Drawer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-slate-100 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="border-b border-slate-50 pb-4 mb-5">
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-indigo-500" />
              {editPlan ? 'Modify Pricing Tier Configuration' : 'Register New Subscription Model'}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Construct high-fidelity candidate feature provisioning limits and financial metrics layout lines.
            </p>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Plan Display Descriptor Text Target Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Identifier Title</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
                placeholder="e.g. Executive Elite Candidate Package"
                className="h-11 border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
            
            {/* Select Dropdown Pricing Framework Architecture */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subscription Allocation Metric</Label>
              <Select value={form.planType} onValueChange={(value) => setForm({ ...form, planType: value })}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-sm font-medium transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 bg-white shadow-2xl p-1.5">
                  <SelectItem value="REQUEST_BASED" className="rounded-lg py-2.5 font-medium text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      <span>Request Based Allocation (Token Bucket)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNLIMITED" className="rounded-lg py-2.5 font-medium text-slate-600 focus:text-indigo-600 focus:bg-indigo-50/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-500" />
                      <span>Unlimited Access (Calendar Matrix Engine)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Subscription Price Metric Block */}
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
                  className="pl-10 h-11 border-slate-200 rounded-xl focus:bg-white text-sm font-medium"
                />
              </div>
            </div>
            
            {/* Conditional Sub-input Configuration Targets */}
            {form.planType === 'REQUEST_BASED' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <Label className="text-xs font-bold uppercase tracking-wider text-purple-600">Total Profile Token Request Balance Allowance</Label>
                <Input
                  type="number"
                  value={form.requestCount}
                  onChange={(e) => setForm({ ...form, requestCount: e.target.value })}
                  required
                  placeholder="e.g. 50"
                  className="h-11 border-purple-200 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 rounded-xl bg-purple-50/10 focus:bg-white text-sm font-medium text-purple-900"
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
                  className="h-11 border-cyan-200 focus:border-cyan-500/80 focus:ring-4 focus:ring-cyan-500/10 rounded-xl bg-cyan-50/10 focus:bg-white text-sm font-medium text-cyan-900"
                />
              </div>
            )}
            
            {/* Product Feature Text Line Matrix Area Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Value Proposition Line Matrix (One item per row line)</Label>
              <Textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4}
                placeholder="View Recruiter Full Verification Profile&#10;Instant Messaging Priority Connect Channel&#10;Premium Resume Spotlight Position Layout Index"
                className="rounded-xl border-slate-200 focus:bg-white p-4"
              />
            </div>
            
            {/* Complete Structural Action Commit Changes Controls */}
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide shadow-md shadow-indigo-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
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