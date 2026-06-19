import { useQuery } from '@tanstack/react-query';
import { School, Users, UserCheck, UserX, GraduationCap, BarChart3, Clock, ArrowUpRight, ShieldAlert, Loader2 } from 'lucide-react';
import { getPlatformStats } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

// Standardized Core Palette Icon mappings for the Purple Theme
const statCardConfigs = [
  { textTheme: 'text-purple-600', bgTheme: 'bg-purple-100' }, // Primary
  { textTheme: 'text-emerald-600', bgTheme: 'bg-emerald-100' }, // Success
  { textTheme: 'text-rose-600', bgTheme: 'bg-rose-100' }, // Danger
  { textTheme: 'text-cyan-600', bgTheme: 'bg-cyan-100' }, // Info
  { textTheme: 'text-indigo-600', bgTheme: 'bg-indigo-100' }, // Secondary Accent
];

const subscriptionBarGradients = [
  'bg-purple-600', // Primary Violet
  'bg-indigo-600', // Deep Purple
  'bg-cyan-600', // Info Blue
  'bg-emerald-600', // Success Teal
];

export default function PlatformStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => getPlatformStats().then((r) => r.data.data),
  });

  // Flat Minimal Loading Skeleton Shimmer State
  if (isLoading) {
    return (
      <div className="space-y-6 p-5 animate-pulse max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
          <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-24 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200/40 dark:bg-slate-800/40 rounded-xl" />
          <div className="h-72 bg-slate-200/40 dark:bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    );
  }

  const totalSchoolsCount = data?.totalSchools || 1;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto antialiased text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Minimalist Page Header Panel */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <PageHeader 
          title="Platform Statistics" 
          description="Comprehensive real-time dashboard analytics, active subscriptions, and onboarded institutions across HireHub." 
        />
      </div>

      {/* Structural Layout Grids for Metric Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[
          { title: 'Total Schools', value: data?.totalSchools || 0, icon: School },
          { title: 'Active Schools', value: data?.activeSchools || 0, icon: UserCheck },
          { title: 'Inactive Schools', value: data?.inactiveSchools || 0, icon: UserX },
          { title: 'Total Candidates', value: data?.totalCandidates || 0, icon: GraduationCap },
          { title: 'School Admins', value: data?.totalUsers || 0, icon: Users },
        ].map((card, i) => {
          const config = statCardConfigs[i % statCardConfigs.length];
          return (
            <Card 
              key={card.title} 
              className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              <CardContent className="p-5 relative flex items-center justify-between">
                <StatCard 
                  title={card.title} 
                  value={card.value} 
                  icon={card.icon} 
                  className="border-none shadow-none bg-transparent p-0 [&_p]:text-2xl [&_p]:font-black [&_p]:tracking-tight [&_p]:text-slate-800 dark:[&_p]:text-white [&_h3]:text-[11px] [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:text-slate-400 dark:[&_h3]:text-slate-500"
                />
                <div className={`p-2 rounded-xl ${config.bgTheme} ${config.textTheme}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Breakdown Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscription Breakdown - Flat Standard Container */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 flex flex-col justify-between">
          <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <BarChart3 className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Subscription Breakdown</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Active platform deployment tiers and distributions</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-5 flex-grow">
            {!data?.subscriptionBreakdown || data.subscriptionBreakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center max-w-xs mx-auto">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 mb-3">
                  <ShieldAlert className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Subscriptions Detected</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Data segments populate live once client systems select a billing path tier package.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {data.subscriptionBreakdown.map((item, index) => {
                  const percentage = Math.round((item.count / totalSchoolsCount) * 100) || 0;
                  const fillColor = subscriptionBarGradients[index % subscriptionBarGradients.length];

                  return (
                    <div key={item._id} className="space-y-2 group">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="capitalize font-bold text-[11px] px-2.5 py-0.5 rounded-lg border-purple-200/60 bg-purple-50/80 text-purple-700 shadow-none"
                          >
                            {item._id || 'Unknown Tier'}
                          </Badge>
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded-lg">
                            {percentage}%
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight">
                          {item.count} {item.count === 1 ? 'school' : 'schools'}
                        </span>
                      </div>
                      
                      {/* Premium Metric Flat Filled Horizontal Track Bar */}
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${fillColor}`}
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

        {/* Recent Schools - Flat Influx Lists Table Layout */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 flex flex-col justify-between overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-xl">
                <Clock className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Recent Schools</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Latest registration stream entries on the network</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-grow">
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/20 text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="font-bold text-[11px] py-4 pl-5 tracking-wider uppercase text-slate-500 dark:text-slate-500">School</TableHead>
                    <TableHead className="font-bold text-[11px] py-4 tracking-wider uppercase text-slate-500 dark:text-slate-500">Plan</TableHead>
                    <TableHead className="font-bold text-[11px] py-4 tracking-wider uppercase text-slate-500 dark:text-slate-500">Status</TableHead>
                    <TableHead className="font-bold text-[11px] py-4 pr-5 tracking-wider uppercase text-slate-500 dark:text-slate-500 text-right">Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!data?.recentSchools || data.recentSchools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-14 text-sm text-slate-400 dark:text-slate-500 font-medium">
                        No onboarded records detected.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.recentSchools.map((school) => (
                      <TableRow 
                        key={school._id} 
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-100 dark:border-slate-800 last:border-none"
                      >
                        <TableCell className="font-bold py-4 pl-5 text-sm text-slate-800 dark:text-slate-200 max-w-[170px] truncate">
                          <div className="flex items-center gap-1">
                            <span className="truncate">{school.schoolName}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 shrink-0 hidden sm:inline-block" />
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline" 
                            className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border-cyan-200/60 bg-cyan-50/80 text-cyan-700 shadow-none capitalize"
                          >
                            {school.subscriptionPlan || 'None'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          {school.isActive ? (
                            <Badge className="border-emerald-200/60 bg-emerald-50/80 text-emerald-700 text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-lg shadow-none variant-outline">
                              <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-emerald-500" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="border-rose-200/60 bg-rose-50/80 text-rose-700 text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-lg shadow-none variant-outline">
                              <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-rose-500" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-slate-400 dark:text-slate-500 pr-5 font-semibold text-right whitespace-nowrap">
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