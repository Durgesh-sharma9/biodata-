import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Coins, Calendar, Sparkles, ArrowUpRight, Loader2 } from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
      name: plan.name,
      credits: String(plan.credits),
      durationDays: String(plan.durationDays),
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      name: form.name,
      credits: Number(form.credits),
      durationDays: Number(form.durationDays),
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto bg-[#f3f3f4] dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen">
      
      {/* Page Header Panel Wrapper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <PageHeader
          title="Subscription Plans"
          description="Configure, customize, and manage active system token bundles and recurring plan nodes for HireHub."
          className="text-slate-800 dark:text-white font-bold tracking-tight text-xl"
        />
        <Button 
          onClick={openCreate}
          className="bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shrink-0 gap-2"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Add Plan
        </Button>
      </div>

      {/* Main Table Interface Layer Constraint */}
      <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Available Packages</CardTitle>
              <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Overview of tier allocations and validity lengths currently integrated into the user interface.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-900/20 text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <TableRow>
                  <TableHead className="pl-6 font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 py-4">Name</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 py-4">Credits</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 py-4">Duration</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 py-4">Status</TableHead>
                  <TableHead className="pr-6 text-right font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="h-5 w-5 text-[#A05AFF] animate-spin" />
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">Syncing product matrices...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 mb-3.5 border border-slate-100 dark:border-slate-800">
                          <Sparkles className="h-5 w-5 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">No active plans configured</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                          Initialize tiered premium attributes for user deployments by triggering the plan onboarding matrix setup modal.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow 
                      key={plan._id} 
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/60 transition-all last:border-none"
                    >
                      <TableCell className="pl-6 py-4 font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight">
                        <div className="flex items-center gap-1.5">
                          <span>{plan.name}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#A05AFF]" />
                        </div>
                      </TableCell>
                      
                      {/* Modern Soft-Tint Info State Badge */}
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] px-2.5 py-1 rounded-xl">
                          <Coins className="h-3.5 w-3.5 shrink-0" />
                          <span>{plan.credits} Tokens</span>
                        </div>
                      </TableCell>
                      
                      {/* Modern Soft-Tint Default Brand State Badge */}
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] px-2.5 py-1 rounded-xl">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{plan.durationDays} Days</span>
                        </div>
                      </TableCell>
                      
                      {/* Modern Soft-Tint Success State Badge */}
                      <TableCell className="py-4">
                        {plan.isActive ?? true ? (
                          <Badge className="border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] text-xs font-semibold px-2.5 py-0.5 rounded-xl shadow-none variant-outline tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-[#1BCFB4]" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-xl shadow-none variant-outline tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-slate-400" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      
                      {/* Action Triggers Grid Matrix */}
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEdit(plan)}
                            className="h-8 w-8 rounded-xl text-slate-400 hover:text-[#A05AFF] hover:bg-[#A05AFF]/10 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(plan._id)}
                            className="h-8 w-8 rounded-xl text-slate-400 hover:text-[#FE9496] hover:bg-[#FE9496]/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Unified Multi-Form Modal Framework */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-xl border-none bg-white p-6 dark:bg-slate-900 shadow-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">
              {editPlan ? '✨ Edit Plan Parameter' : '🚀 Launch Premium Plan'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="pt-4">
            <form id="plan-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Plan Title Name</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. Enterprise Tier, Starter Pack"
                  className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm"
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Included Credits</Label>
                  <div className="relative group">
                    <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#A05AFF] transition-colors" />
                    <Input
                      type="number"
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: e.target.value })}
                      placeholder="500"
                      className="pl-10 h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Validity Duration (Days)</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#A05AFF] transition-colors" />
                    <Input
                      type="number"
                      value={form.durationDays}
                      onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                      placeholder="30"
                      className="pl-10 h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </DialogBody>
          <DialogFooter className="mt-6 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="rounded-xl h-11 font-medium transition-all border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="plan-form"
              disabled={saveMutation.isPending}
              className="bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl h-11 px-5 transition-all duration-200 active:scale-95"
            >
              {saveMutation.isPending ? 'Processing...' : 'Apply Configurations'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}