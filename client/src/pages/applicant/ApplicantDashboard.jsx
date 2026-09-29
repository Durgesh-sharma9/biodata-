import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Inbox,
  CreditCard,
  Bell,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Compass,
  TrendingUp,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { getApplicantDashboard, getApplicantProfile, getReceivedRequests } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function ApplicantDashboard() {
  const { data: dash, isLoading: dashLoading } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => getApplicantDashboard().then((r) => r.data.data),
  });

  const { data: profile } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => getApplicantProfile().then((r) => r.data.data),
  });

  const { data: requestsData } = useQuery({
    queryKey: ['applicant-requests'],
    queryFn: () => getReceivedRequests().then((r) => r.data),
  });

  if (dashLoading) {
    return (
      <div className="flex h-72 flex-col items-center justify-center space-y-3 antialiased">
        <div className="h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Loading your job seeker dashboard...</p>
      </div>
    );
  }

  const requests = requestsData?.data || [];
  const candidateName = profile?.fullName || 'Candidate';
  const roleName = profile?.position || 'Job Seeker';
  const hasDocuments = (profile?.documents?.length || 0) > 0;
  const isProfileComplete = Boolean(profile?._id && profile?.position && profile?.fullName);

  // Calculate profile completion score
  let score = 20;
  if (profile?.fullName) score += 20;
  if (profile?.position) score += 20;
  if (profile?.mobile) score += 15;
  if (profile?.qualifications?.length > 0) score += 15;
  if (hasDocuments) score += 10;
  score = Math.min(score, 100);

  const stats = [
    {
      label: 'Received Requests',
      value: dash?.requestCount || 0,
      sublabel: 'School inquiries',
      icon: Inbox,
      to: '/applicant/requests',
      accentColor: 'text-blue-600 dark:text-blue-400',
      bgTint: 'bg-blue-500/10',
    },
    {
      label: 'Uploaded Documents',
      value: dash?.documentCount || 0,
      sublabel: 'Resumes & certificates',
      icon: FileText,
      to: '/applicant/documents',
      accentColor: 'text-indigo-600 dark:text-indigo-400',
      bgTint: 'bg-indigo-500/10',
    },
    {
      label: 'Active Plan',
      value: dash?.hasActivePlan ? 'Premium' : (dash?.subscription?.planName || 'Free'),
      sublabel: `${dash?.requestCredits || 0} Request Credits`,
      icon: CreditCard,
      to: '/applicant/plan',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      bgTint: 'bg-emerald-500/10',
    },
    {
      label: 'Notifications',
      value: dash?.unreadNotifications || 0,
      sublabel: 'System alerts',
      icon: Bell,
      to: '/applicant/notifications',
      accentColor: 'text-slate-600 dark:text-slate-300',
      bgTint: 'bg-slate-500/10',
    },
  ];

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white max-w-6xl mx-auto pb-10">
      
      {/* Candidate Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute top-0 right-0 h-48 w-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none rounded-bl-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-bold text-xs px-3 py-1 rounded-xl">
                {roleName}
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-semibold px-2.5 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Active in Talent Pool
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome back, {candidateName}! 👋
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Your profile is active and discoverable by schools searching for qualified candidates. Review inquiries and keep your credentials updated.
              </p>
            </div>

            {/* Profile Completion Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" /> Profile Strength
                </span>
                <span className="text-blue-600 dark:text-blue-400">{score}% Complete</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
              {score < 100 && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Upload your resume and certifications to reach 100% and get 3x more inquiries.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
            <Button
              asChild
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Link to="/applicant/profile">
                <span>View Full Profile</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              <Link to="/applicant/profile?edit=true">Edit Biodata Details</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, sublabel, icon: Icon, to, accentColor, bgTint }) => (
          <Link key={label} to={to} className="group">
            <Card className="border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-md rounded-2xl overflow-hidden p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${bgTint} ${accentColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {value}
              </p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {label}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {sublabel}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* 2-Column Section: Recent Inquiries + Pro Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Recent Inquiries */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Inbox className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Recent School Inquiries
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Schools interested in hiring you for open positions
                  </CardDescription>
                </div>
              </div>

              <Button asChild variant="ghost" className="text-xs font-bold text-blue-600 hover:text-blue-700 h-auto p-0">
                <Link to="/applicant/requests">View All ({requests.length})</Link>
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-5">
              {requests.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <Building2 className="h-9 w-9 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No School Inquiries Yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Verified schools browse the talent pool daily. Make sure your qualifications and preferred location are up to date!
                  </p>
                  <Button asChild variant="outline" className="mt-4 rounded-xl text-xs font-semibold border-slate-200">
                    <Link to="/applicant/profile?edit=true">Review Profile Details</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 3).map((req) => (
                    <div
                      key={req._id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-800/40 dark:border-slate-800 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {req.schoolName || 'School Inquiry'}
                          </h4>
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-[10px] font-bold">
                            {req.positionOffered || 'Teaching Role'}
                          </Badge>
                          {req.isUnlocked && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px] font-bold">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        {req.message && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                            "{req.message}"
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Received on {formatDate(req.createdAt)}
                        </p>
                      </div>

                      <Button
                        asChild
                        size="sm"
                        className="rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-200 transition-colors shrink-0"
                      >
                        <Link to="/applicant/requests">
                          {req.isUnlocked ? 'Contact School' : 'Unlock Request'}
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right (1 col): Career Tips & Guidance */}
        <div className="space-y-6">
          <Card className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Candidate Tips
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload PDF Resume</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Schools prefer candidates who attach an official PDF resume and degree credentials.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Set Accurate Commute Radius</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Specifying 15-25 km helps matching schools nearby find you quickly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Keep Contacts Updated</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Ensure your mobile and email are active so you never miss an interview invitation.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <Link to="/applicant/profile">Review My Biodata</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
