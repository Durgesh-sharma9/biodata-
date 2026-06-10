import { useQuery } from '@tanstack/react-query';
import { Users, School, Package } from 'lucide-react';
import { getSuperAdminDashboard } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getSuperAdminDashboard().then((r) => r.data.data),
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;

  return (
    <div>
      <PageHeader title="Dashboard" description="Platform overview" />

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard title="Total Schools" value={data?.totalSchools || 0} icon={School} />
        <StatCard title="Active Schools" value={data?.activeSchools || 0} icon={School} />
        <StatCard title="Total Candidates" value={data?.totalCandidates || 0} icon={Users} />
        <StatCard title="Active Plans" value={data?.totalPlans || 0} icon={Package} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentCandidates?.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.fullName}</TableCell>
                  <TableCell>{c.position}</TableCell>
                  <TableCell>{c.source}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
