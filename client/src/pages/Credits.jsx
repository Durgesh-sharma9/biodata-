import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchoolCredits, getUnlockHistory, getCreditPackages, purchaseCreditPackage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function Credits() {
  const { refreshSchool } = useAuth();
  const queryClient = useQueryClient();

  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: () => getSchoolCredits().then((r) => r.data.data),
  });

  const { data: history = [] } = useQuery({
    queryKey: ['unlock-history'],
    queryFn: () => getUnlockHistory().then((r) => r.data.data),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => getCreditPackages().then((r) => r.data.data),
  });

  const purchaseMutation = useMutation({
    mutationFn: (packageId) => purchaseCreditPackage(packageId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      await refreshSchool();
    },
  });

  return (
    <div>
      <PageHeader title="Credits" description="Manage your credits and unlock history" />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Available Credits</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{credits?.credits ?? 0}</p>
            {credits?.plan && (
              <p className="mt-2 text-sm text-muted-foreground">
                Plan: {credits.plan.name} — expires {credits.expiryDate ? formatDate(credits.expiryDate) : 'N/A'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Purchase Credits</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {packages.filter((p) => p.isActive !== false).map((pkg) => (
              <div key={pkg._id} className="flex items-center justify-between rounded border px-3 py-2">
                <span>{pkg.name} — {pkg.credits} credits</span>
                <Button size="sm" onClick={() => purchaseMutation.mutate(pkg._id)} disabled={purchaseMutation.isPending}>
                  Purchase
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Unlock History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Unlocked On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No unlock history</TableCell>
                </TableRow>
              ) : (
                history.map((h) => (
                  <TableRow key={h._id}>
                    <TableCell>{h.candidateId?.fullName}</TableCell>
                    <TableCell>{h.candidateId?.position}</TableCell>
                    <TableCell>{h.candidateId?.source}</TableCell>
                    <TableCell>{formatDate(h.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
