import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Power, Pencil } from 'lucide-react';
import { getSchools, toggleSchoolStatus, updateSchool } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

const emptyForm = {
  schoolName: '',
  email: '',
  phone: '',
  subscriptionPlan: 'basic',
  subscriptionStatus: 'trial',
  startDate: '',
  expiryDate: '',
};

export default function Schools() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['schools', page, search, status],
    queryFn: () =>
      getSchools({
        page,
        limit: 10,
        search,
        status: status || undefined,
      }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setDialogOpen(false);
      setEditSchool(null);
      setForm(emptyForm);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleSchoolStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schools'] }),
  });

  const openEdit = (school) => {
    setEditSchool(school);
    setForm({
      schoolName: school.schoolName,
      email: school.email,
      phone: school.phone || '',
      subscriptionPlan: school.subscriptionPlan,
      subscriptionStatus: school.subscriptionStatus,
      startDate: school.startDate ? school.startDate.split('T')[0] : '',
      expiryDate: school.expiryDate ? school.expiryDate.split('T')[0] : '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editSchool) {
      updateMutation.mutate({ id: editSchool._id, data: form });
    }
  };

  return (
    <div>
      <PageHeader
        title="Schools"
        description="Manage schools and subscriptions"
      />

      <Card className="mb-6">
        <CardContent className="flex gap-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((school) => (
                  <TableRow key={school._id}>
                    <TableCell className="font-medium">{school.schoolName}</TableCell>
                    <TableCell>{school.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{school.subscriptionPlan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.subscriptionStatus === 'active' ? 'success' : 'warning'}>
                        {school.subscriptionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.isActive ? 'success' : 'destructive'}>
                        {school.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(school.expiryDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(school)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleMutation.mutate(school._id)}
                          disabled={toggleMutation.isPending}
                        >
                          <Power className={`h-4 w-4 ${school.isActive ? 'text-destructive' : 'text-green-600'}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>School Name *</Label>
                <Input
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>School Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <Select value={form.subscriptionPlan} onValueChange={(v) => setForm({ ...form, subscriptionPlan: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subscription Status</Label>
                <Select value={form.subscriptionStatus} onValueChange={(v) => setForm({ ...form, subscriptionStatus: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
