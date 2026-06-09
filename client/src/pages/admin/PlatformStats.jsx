import { useQuery } from '@tanstack/react-query';
import { School, Users, UserCheck, UserX, GraduationCap } from 'lucide-react';
import { getPlatformStats } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function PlatformStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => getPlatformStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Platform Statistics" description="Overview of the entire platform" />

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Schools" value={data?.totalSchools || 0} icon={School} />
        <StatCard title="Active Schools" value={data?.activeSchools || 0} icon={UserCheck} />
        <StatCard title="Inactive Schools" value={data?.inactiveSchools || 0} icon={UserX} />
        <StatCard title="Total Candidates" value={data?.totalCandidates || 0} icon={GraduationCap} />
        <StatCard title="School Admins" value={data?.totalUsers || 0} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.subscriptionBreakdown?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {item._id || 'Unknown'}
                  </Badge>
                  <span className="font-semibold">{item.count} schools</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentSchools?.map((school) => (
                  <TableRow key={school._id}>
                    <TableCell className="font-medium">{school.schoolName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{school.subscriptionPlan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.isActive ? 'success' : 'destructive'}>
                        {school.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(school.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
