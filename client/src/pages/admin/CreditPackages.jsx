import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { getCreditPackages, createCreditPackage, deleteCreditPackage } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreditPackages() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', credits: '' });

  const { data: packages = [] } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => getCreditPackages().then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: createCreditPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-packages'] });
      setDialogOpen(false);
      setForm({ name: '', credits: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCreditPackage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['credit-packages'] }),
  });

  return (
    <div>
      <PageHeader
        title="Credit Packages"
        description="Standalone credit packages for schools"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Package
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg._id}>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{pkg.credits}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(pkg._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credit Package</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate({ name: form.name, credits: Number(form.credits) });
            }}
            className="space-y-4"
          >
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
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
