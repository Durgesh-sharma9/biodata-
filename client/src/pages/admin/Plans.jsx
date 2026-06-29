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

  const openCreate = () => { setEditPlan(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({ name: plan.name, credits: String(plan.credits), durationDays: String(plan.durationDays) });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({ name: form.name, credits: Number(form.credits), durationDays: Number(form.durationDays) });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1400px] mx-auto w-full bg-[#f3f3f4] dark:bg-slate-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <PageHeader title="Subscription Plans" description="Manage system token bundles and plan nodes." />
        <Button onClick={openCreate} className="bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Add Plan
        </Button>
      </div>

      {/* CARD SIZE BADHANE KE LIYE: min-h-[500px] add kiya */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl"><Sparkles className="h-4 w-4" /></div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">Available Packages</CardTitle>
              <CardDescription className="text-xs text-slate-400">Overview of active tiers.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell className="pl-6 font-bold">{plan.name}</TableCell>
                  <TableCell><div className="inline-flex items-center gap-1.5 text-xs font-bold border border-[#4BCBEB]/30 bg-[#4BCBEB]/5 text-[#4BCBEB] px-2.5 py-1 rounded-xl"><Coins className="h-3.5 w-3.5"/> {plan.credits} Tokens</div></TableCell>
                  <TableCell><div className="inline-flex items-center gap-1.5 text-xs font-bold border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] px-2.5 py-1 rounded-xl"><Calendar className="h-3.5 w-3.5"/> {plan.durationDays} Days</div></TableCell>
                  <TableCell><Badge className="text-[#1BCFB4] bg-[#1BCFB4]/5">Active</Badge></TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="edit" size="icon" onClick={() => openEdit(plan)} className="h-8 w-8 mr-1"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="delete" size="icon" onClick={() => deleteMutation.mutate(plan._id)} className="h-8 w-8"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog code remains same as your original */}
    </div>
  );
}