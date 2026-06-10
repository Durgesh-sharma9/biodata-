import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getAdmins, getPlans, assignCreditsToSchool } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Admins() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [assignDialog, setAssignDialog] = useState(null);
  const [planId, setPlanId] = useState('');
  const [extraCredits, setExtraCredits] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admins', page, search],
    queryFn: () => getAdmins({ page, limit: 10, search }).then((r) => r.data),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getPlans().then((r) => r.data.data),
  });

  const assignMutation = useMutation({
    mutationFn: assignCreditsToSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setAssignDialog(null);
      setPlanId('');
      setExtraCredits('');
    },
  });

  const handleAssign = () => {
    assignMutation.mutate({
      schoolId: assignDialog._id,
      planId: planId || undefined,
      credits: extraCredits ? Number(extraCredits) : undefined,
    });
  };

  return (
    <div>
      <PageHeader title="Admins" description="All registered schools and administrators" />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : (
                data?.data?.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">{admin.schoolName}</TableCell>
                    <TableCell>{admin.adminName}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.mobile || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{admin.credits}</TableCell>
                    <TableCell>{admin.plan?.name || '-'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setAssignDialog(admin)}>
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Plan / Credits — {assignDialog?.schoolName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Plan</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name} — {p.credits} credits / {p.durationDays} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Extra Credits</Label>
              <Input
                type="number"
                placeholder="Additional credits"
                value={extraCredits}
                onChange={(e) => setExtraCredits(e.target.value)}
              />
            </div>
            <Button onClick={handleAssign} disabled={assignMutation.isPending}>
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
