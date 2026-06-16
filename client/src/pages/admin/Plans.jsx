import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Coins, Calendar, Sparkles, ArrowUpRight } from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto antialiased text-foreground bg-background">
      
      {/* Modern SaaS Header Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageHeader
          title="Subscription Plans"
          description="Configure, customize, and manage active system token bundles and recurring plan nodes for HireHub."
        />
        <Button 
          onClick={openCreate}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl h-10 px-4 shadow-sm hover:shadow-md transition-all duration-200 self-start sm:self-auto shrink-0 z-10 gap-2"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Plan
        </Button>
      </div>

      {/* Main Table Interface Shell */}
      <Card className="border border-slate-200/60 bg-background shadow-xs rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 sm:p-8 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
          <CardTitle className="text-base font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>Available Packages</span>
          </CardTitle>
          <CardDescription className="text-xs font-medium text-muted-foreground pl-10">
            Overview of tier allocations and validity lengths currently integrated into the user interface.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
                <TableRow>
                  <TableHead className="pl-6 sm:pl-8 font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Name</TableHead>
                  <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Credits</TableHead>
                  <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Duration</TableHead>
                  <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Status</TableHead>
                  <TableHead className="pr-6 sm:pr-8 text-right font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                        <div className="h-8 w-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                        <span className="text-xs font-semibold text-muted-foreground tracking-wide">Syncing product matrices...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-muted-foreground/60 mb-3.5 shadow-2xs">
                          <Sparkles className="h-5 w-5 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground tracking-tight">No active plans configured</h4>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          Initialize tiered premium attributes for user deployments by triggering the plan onboarding matrix setup modal.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow 
                      key={plan._id} 
                      className="group hover:bg-slate-50/40 dark:hover:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/60 transition-colors last:border-none"
                    >
                      <TableCell className="pl-6 sm:pl-8 py-4 font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                        <div className="flex items-center gap-1.5">
                          <span>{plan.name}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 font-semibold text-sm bg-blue-500/10 text-blue-600 dark:bg-blue-950 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                          <Coins className="h-3.5 w-3.5 shrink-0" />
                          <span>{plan.credits} Tokens</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2.5 py-1 rounded-lg">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>{plan.durationDays} Days</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <Badge 
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs tracking-wide ${
                            plan.isActive ?? true
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400' 
                              : 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${plan.isActive ?? true ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {plan.isActive ?? true ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="pr-6 sm:pr-8 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEdit(plan)}
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(plan._id)}
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
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

      {/* Premium Form Creation/Edit Dialog Context Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {editPlan ? '✨ Edit Plan Parameter' : '🚀 Launch Premium Plan'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Title Name</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. Enterprise Tier, Starter Pack"
                  className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-4 transition-all"
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Included Credits</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: e.target.value })}
                      placeholder="500"
                      className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-9 transition-all"
                      required
                    />
                    <Coins className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Validity Duration</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={form.durationDays}
                      onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                      placeholder="30 days"
                      className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-9 transition-all"
                      required
                    />
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="w-full rounded-xl h-11 font-medium transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saveMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl h-11 shadow-sm hover:shadow-md transition-all"
                >
                  {saveMutation.isPending ? 'Processing...' : 'Apply Configurations'}
                </Button>
              </div>
            </form>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}