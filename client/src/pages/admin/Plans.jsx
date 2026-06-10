import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    <div>
      <PageHeader
        title="Plans"
        description="Manage subscription plans"
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
                <TableHead>Credits</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.credits}</TableCell>
                    <TableCell>{plan.durationDays} days</TableCell>
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
            <DialogTitle>{editPlan ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label>Credits</Label>
              <Input
                type="number"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
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
            <Button type="submit" disabled={saveMutation.isPending}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
