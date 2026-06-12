import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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

const emptyForm = { name: '', price: '', durationDays: '', features: '' };

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
      price: String(plan.price),
      durationDays: String(plan.durationDays),
      features: plan.features?.join('\n') || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      name: form.name,
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      isActive: editPlan ? editPlan.isActive : true,
    });
  };

  return (
    <div>
      <PageHeader
        title="Applicant Plans"
        description="Manage subscription plans for self-applicants"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>₹{plan.price}</TableCell>
                    <TableCell>{plan.durationDays} days</TableCell>
                    <TableCell className="max-w-xs truncate text-xs">
                      {plan.features?.join(', ')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(plan)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(plan._id)}
                        disabled={!plan.isActive}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editPlan ? 'Edit Applicant Plan' : 'Create Applicant Plan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Duration (days)</Label>
              <Input
                type="number"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4}
                placeholder="View School Contact&#10;Contact School"
              />
            </div>
            <Button type="submit" disabled={saveMutation.isPending}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
