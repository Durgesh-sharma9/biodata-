import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Coins, Plus, List } from 'lucide-react';
import { getDashboardStats } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your candidate database"
        action={
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/candidates/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Candidate
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/candidates">
                <List className="mr-2 h-4 w-4" />
                View Candidates
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Candidates" value={data?.totalCandidates || 0} icon={Users} />
        <StatCard title="Your Candidates" value={data?.ownedCandidates || 0} icon={Users} />
        <StatCard title="Available Credits" value={data?.availableCredits || 0} icon={Coins} />
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
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentCandidates?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No candidates yet
                  </TableCell>
                </TableRow>
              ) : (
                data?.recentCandidates?.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>
                      <Link to={`/candidates/${c._id}`} className="font-medium text-primary hover:underline">
                        {c.fullName}
                        {c.isLocked && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Locked
                          </Badge>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>{c.position}</TableCell>
                    <TableCell>{c.source}</TableCell>
                    <TableCell>{formatDate(c.createdAt)}</TableCell>
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
