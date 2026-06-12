import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, FileText, Inbox, CreditCard, Bell } from 'lucide-react';
import { getApplicantDashboard } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ApplicantDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => getApplicantDashboard().then((r) => r.data.data),
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  const stats = [
    { label: 'Received Requests', value: data?.requestCount || 0, icon: Inbox, to: '/applicant/requests' },
    { label: 'Documents', value: data?.documentCount || 0, icon: FileText, to: '/applicant/documents' },
    { label: 'Unread Notifications', value: data?.unreadNotifications || 0, icon: Bell, to: '/applicant/notifications' },
    {
      label: 'Active Plan',
      value: data?.hasActivePlan ? data.subscription?.planName || 'Active' : 'Free',
      icon: CreditCard,
      to: '/applicant/plan',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Applicant Dashboard"
        description="Manage your profile, requests, and subscription"
      />

      {!data?.profileComplete && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Complete your profile to receive more interest from schools.{' '}
          <Link to="/applicant/profile" className="font-medium underline">
            Edit Profile
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <Button variant="link" className="mt-2 h-auto p-0" asChild>
                <Link to={to}>View</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/applicant/profile">Edit Profile</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/applicant/requests">View Requests</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/applicant/plan">Manage Plan</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
