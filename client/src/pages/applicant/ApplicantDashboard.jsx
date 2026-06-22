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
    { label: 'Received Requests', value: data?.requestCount || 0, icon: Inbox, to: '/applicant/requests', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Documents', value: data?.documentCount || 0, icon: FileText, to: '/applicant/documents', color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { label: 'Unread Notifications', value: data?.unreadNotifications || 0, icon: Bell, to: '/applicant/notifications', color: 'text-rose-600', bg: 'bg-rose-100' },
    {
      label: 'Active Plan',
      value: data?.hasActivePlan ? data.subscription?.planName || 'Active' : 'Free',
      icon: CreditCard,
      to: '/applicant/plan',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto w-full bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      <PageHeader
        title="Applicant Dashboard"
        description="Manage your profile, requests, and subscription"
      />

      {!data?.profileComplete && (
        <div className="mb-6 rounded-xl border border-amber-200/60 bg-amber-50/80 p-4 text-sm text-amber-800">
          Complete your profile to receive more interest from schools.{' '}
          <Link to="/applicant/profile" className="font-medium underline">
            Edit Profile
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to, color, bg }) => (
          <Card key={label} className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</CardTitle>
              <div className={`p-2 rounded-lg ${bg} ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{value}</p>
              <Button variant="link" className="mt-2 h-auto p-0 text-purple-600 font-semibold hover:text-purple-700" asChild>
                <Link to={to}>View</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <Users className="h-5 w-5 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50 hover:text-purple-600">
            <Link to="/applicant/profile">Edit Profile</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50 hover:text-purple-600">
            <Link to="/applicant/requests">View Requests</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50 hover:text-purple-600">
            <Link to="/applicant/plan">Manage Plan</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
