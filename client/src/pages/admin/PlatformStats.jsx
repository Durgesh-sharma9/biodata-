import { useQuery } from '@tanstack/react-query';
import { School, Users, UserCheck, UserX, GraduationCap, BarChart3, Clock, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { getPlatformStats } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

// Premium interactive hover and border mappings tailored to the HireHub SaaS palette
const statCardWrappers = [
  { hoverBorder: 'hover:border-blue-500/50 hover:shadow-blue-500/5', dotColor: 'bg-blue-500' },
  { hoverBorder: 'hover:border-green-500/50 hover:shadow-green-500/5', dotColor: 'bg-green-500' },
  { hoverBorder: 'hover:border-red-500/50 hover:shadow-red-500/5', dotColor: 'bg-red-500' },
  { hoverBorder: 'hover:border-purple-500/50 hover:shadow-purple-500/5', dotColor: 'bg-purple-500' },
  { hoverBorder: 'hover:border-orange-500/50 hover:shadow-orange-500/5', dotColor: 'bg-orange-500' },
];

const subscriptionBarGradients = [
  'bg-gradient-to-r from-blue-500 to-indigo-500',
  'bg-gradient-to-r from-purple-500 to-pink-500',
  'bg-gradient-to-r from-orange-500 to-amber-500',
  'bg-gradient-to-r from-cyan-500 to-blue-600',
];

export default function PlatformStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => getPlatformStats().then((r) => r.data.data),
  });

  // Premium Shimmer Loading State - Structural 1:1 replacement keeping layout exact
  if (isLoading) {
    return (
      <div className="space-y-8 p-4 md:p-8 animate-pulse max-w-7xl mx-auto">
        <div className="space-y-3">
          <div className="h-8 bg-muted/70 rounded-xl w-64" />
          <div className="h-4 bg-muted/50 rounded-lg w-96" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-28 bg-muted/40 rounded-2xl border border-muted/30" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 bg-muted/30 rounded-2xl" />
          <div className="h-80 bg-muted/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalSchoolsCount = data?.totalSchools || 1;

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto antialiased text-foreground bg-background">
      
      {/* Modern Top Branding Container */}
      <div className="relative overflow-hidden rounded-2xl border border-muted/70 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/30 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/40 shadow-xs">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-44 h-44 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageHeader 
          title="Platform Statistics" 
          description="Comprehensive real-time dashboard analytics, active subscriptions, and onboarded institutions across HireHub." 
        />
      </div>

      {/* Colorful Premium Statistics Card Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { title: 'Total Schools', value: data?.totalSchools || 0, icon: School },
          { title: 'Active Schools', value: data?.activeSchools || 0, icon: UserCheck },
          { title: 'Inactive Schools', value: data?.inactiveSchools || 0, icon: UserX },
          { title: 'Total Candidates', value: data?.totalCandidates || 0, icon: GraduationCap },
          { title: 'School Admins', value: data?.totalUsers || 0, icon: Users },
        ].map((card, i) => {
          const config = statCardWrappers[i];
          return (
            <div 
              key={card.title} 
              className={`group relative overflow-hidden rounded-2xl border border-muted/70 bg-card p-1 shadow-xs transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${config.hoverBorder}`}
            >
              <div className={`absolute top-0 left-4 h-[3px] w-12 rounded-full ${config.dotColor}`} />
              <StatCard 
                title={card.title} 
                value={card.value} 
                icon={card.icon} 
                className="border-none shadow-none bg-transparent [&_p]:text-3xl [&_p]:font-black [&_p]:tracking-tight [&_h3]:text-muted-foreground/90 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wider"
              />
            </div>
          );
        })}
      </div>

      {/* Analytics Breakdown Grid Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Subscription Breakdown - Enhanced Progress Metric Card */}
        <Card className="rounded-2xl shadow-xs border border-muted/70 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-sm">
          <CardHeader className="border-b border-muted/40 bg-slate-50/40 dark:bg-slate-900/10 pb-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <BarChart3 className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Subscription Breakdown</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground/80">Active platform deployment tiers and distributions</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 flex-grow">
            {!data?.subscriptionBreakdown || data.subscriptionBreakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center max-w-xs mx-auto">
                <div className="p-3 bg-muted/40 rounded-xl text-muted-foreground/50 mb-3">
                  <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No Subscriptions Detected</h4>
                <p className="text-xs text-muted-foreground mt-1">Data segments populate live once client systems select a billing path tier package.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {data.subscriptionBreakdown.map((item, index) => {
                  const percentage = Math.round((item.count / totalSchoolsCount) * 100) || 0;
                  const barColor = subscriptionBarGradients[index % subscriptionBarGradients.length];

                  return (
                    <div key={item._id} className="space-y-2 group">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="capitalize font-bold text-xs px-2.5 py-0.5 rounded-lg bg-background border-muted/80 group-hover:border-indigo-300 group-hover:bg-indigo-500/5 transition-colors"
                          >
                            {item._id || 'Unknown Tier'}
                          </Badge>
                          <span className="text-[11px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                            {percentage}%
                          </span>
                        </div>
                        <span className="font-extrabold text-foreground text-sm tracking-tight">
                          {item.count} {item.count === 1 ? 'school' : 'schools'}
                        </span>
                      </div>
                      
                      {/* Premium Horizontal Bar Metric Filled dynamically */}
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Schools - Polished Modern Data Table View */}
        <Card className="rounded-2xl shadow-xs border border-muted/70 overflow-hidden transition-all duration-300 hover:shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-muted/40 bg-slate-50/40 dark:bg-slate-900/10 pb-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Clock className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Recent Schools</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground/80">Latest registration stream entries on the network</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-grow">
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-muted/40">
                  <TableRow>
                    <TableHead className="font-bold text-xs py-3.5 pl-6 tracking-wider uppercase text-muted-foreground/90">School</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 tracking-wider uppercase text-muted-foreground/90">Plan</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 tracking-wider uppercase text-muted-foreground/90">Status</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 pr-6 tracking-wider uppercase text-muted-foreground/90 text-right">Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!data?.recentSchools || data.recentSchools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-14 text-sm text-muted-foreground font-medium">
                        No onboarded records detected.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.recentSchools.map((school) => (
                      <TableRow key={school._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 group transition-colors border-b border-muted/30 last:border-0">
                        <TableCell className="font-bold py-4 pl-6 text-sm text-slate-900 dark:text-slate-100 max-w-[170px] truncate">
                          <div className="flex items-center gap-1">
                            <span className="truncate">{school.schoolName}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-blue-500 shrink-0 hidden sm:inline-block" />
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline" 
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md border-blue-100 bg-blue-50/30 text-blue-600 dark:border-blue-950 dark:bg-blue-950/20 dark:text-blue-400 capitalize"
                          >
                            {school.subscriptionPlan || 'None'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-3xs tracking-wide ${
                              school.isActive 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400' 
                                : 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${school.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            {school.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-muted-foreground pr-6 font-semibold text-right whitespace-nowrap">
                          {formatDate(school.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}