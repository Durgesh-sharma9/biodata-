import { useQuery } from '@tanstack/react-query';
import { Users, School, Package, TrendingUp, Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { getSuperAdminDashboard } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Restored cn utility dependency safely

export default function AdminDashboard() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getSuperAdminDashboard().then((r) => r.data.data),
  });

  // Modern SaaS Shimmer Skeleton Loader - 100% functionality preserving placeholder layout
  if (isLoading) {
    return (
      <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-full sm:w-1/3">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-lg w-full" />
          </div>
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-32 shrink-0" />
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/40" />
          ))}
        </div>
        <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto antialiased text-foreground bg-background">
      
      {/* Upper Navigation Header Frame - Polished Premium Look */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageHeader 
          title="Dashboard" 
          description="Global platform performance, workspace infrastructure, and tracking overview." 
        />
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 z-10">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="gap-2 font-bold shadow-xs bg-background border-slate-200 text-slate-700 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-300 dark:hover:text-indigo-400 rounded-xl px-4 h-10 transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-900"
          >
            <RefreshCcw className={cn("h-3.5 w-3.5 text-slate-400 transition-transform duration-500", isFetching && "animate-spin text-indigo-500")} />
            {isFetching ? "Syncing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Premium Visual Summary Stat Cards Layout Row */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Schools - Indigo Accent */}
        <div className="relative overflow-hidden group rounded-2xl border border-slate-200/60 bg-background p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-blue-500/40 hover:-translate-y-1">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-blue-50/30 dark:bg-blue-950/10 group-hover:bg-blue-50/50 group-hover:scale-110 transition-all duration-300" />
          <StatCard 
            title="Total Schools" 
            value={data?.totalSchools || 0} 
            icon={School} 
            className="[&_svg]:text-blue-600 dark:[&_svg]:text-blue-400 [&_h3]:text-slate-400 [&_h3]:font-medium [&_p]:text-slate-900 dark:[&_p]:text-white [&_p]:font-extrabold [&_p]:tracking-tight [&_p]:text-3xl"
          />
        </div>

        {/* Active Schools - Emerald Accent */}
        <div className="relative overflow-hidden group rounded-2xl border border-slate-200/60 bg-background p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-emerald-500/40 hover:-translate-y-1">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-50/30 dark:bg-emerald-950/10 group-hover:bg-emerald-50/50 group-hover:scale-110 transition-all duration-300" />
          <StatCard 
            title="Active Schools" 
            value={data?.activeSchools || 0} 
            icon={School} 
            className="[&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400 [&_h3]:text-slate-400 [&_h3]:font-medium [&_p]:text-slate-900 dark:[&_p]:text-white [&_p]:font-extrabold [&_p]:tracking-tight [&_p]:text-3xl"
          />
        </div>

        {/* Total Candidates - Purple Accent */}
        <div className="relative overflow-hidden group rounded-2xl border border-slate-200/60 bg-background p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-purple-500/40 hover:-translate-y-1">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-purple-50/30 dark:bg-purple-950/10 group-hover:bg-purple-50/50 group-hover:scale-110 transition-all duration-300" />
          <StatCard 
            title="Total Candidates" 
            value={data?.totalCandidates || 0} 
            icon={Users} 
            className="[&_svg]:text-purple-600 dark:[&_svg]:text-purple-400 [&_h3]:text-slate-400 [&_h3]:font-medium [&_p]:text-slate-900 dark:[&_p]:text-white [&_p]:font-extrabold [&_p]:tracking-tight [&_p]:text-3xl"
          />
        </div>

        {/* Active Plans - Amber Accent */}
        <div className="relative overflow-hidden group rounded-2xl border border-slate-200/60 bg-background p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-500/40 hover:-translate-y-1">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-50/30 dark:bg-amber-950/10 group-hover:bg-amber-50/50 group-hover:scale-110 transition-all duration-300" />
          <StatCard 
            title="Active Plans" 
            value={data?.totalPlans || 0} 
            icon={Package} 
            className="[&_svg]:text-amber-600 dark:[&_svg]:text-amber-400 [&_h3]:text-slate-400 [&_h3]:font-medium [&_p]:text-slate-900 dark:[&_p]:text-white [&_p]:font-extrabold [&_p]:tracking-tight [&_p]:text-3xl"
          />
        </div>
      </div>

      {/* Main Stream Candidate Matrix Data Table Container */}
      <Card className="border border-slate-200/60 bg-background shadow-xs rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 sm:p-8 flex flex-row items-center justify-between flex-wrap gap-4 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
          <div className="space-y-1.5">
            <CardTitle className="text-base font-bold text-foreground tracking-tight flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-2xs">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>Recent Candidates</span>
            </CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground pl-10">
              Live processing stream of incoming talent and applications.
            </CardDescription>
          </div>
          <Badge className="px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border-none font-bold text-xs tracking-wide rounded-full animate-pulse">
            Realtime Stream
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
                <TableRow>
                  <TableHead className="pl-6 sm:pl-8 font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Candidate Profile</TableHead>
                  <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Target Position</TableHead>
                  <TableHead className="font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Acquisition Source</TableHead>
                  <TableHead className="pr-6 sm:pr-8 text-right font-bold text-xs tracking-wider uppercase text-muted-foreground/90 py-3.5">Ingest Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentCandidates && data.recentCandidates.length > 0 ? (
                  data.recentCandidates.map((c) => (
                    <TableRow 
                      key={c._id} 
                      className="group hover:bg-slate-50/40 dark:hover:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/60 transition-colors last:border-none"
                    >
                      {/* Name Avatar Cell */}
                      <TableCell className="pl-6 sm:pl-8 py-4 font-semibold text-foreground/90 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 text-xs font-black border border-indigo-100/40 dark:border-indigo-900/30 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-indigo-500 group-hover:text-white group-hover:scale-105 group-hover:shadow-xs transition-all duration-200">
                            {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="truncate max-w-[160px] sm:max-w-[220px] tracking-tight">{c.fullName}</span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-indigo-500 shrink-0 hidden sm:inline-block" />
                          </div>
                        </div>
                      </TableCell>

                      {/* Position Tag Cell */}
                      <TableCell className="py-4 font-medium text-sm">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200/40 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
                          {c.position}
                        </span>
                      </TableCell>

                      {/* Dynamic Acquisition Badge Cell */}
                      <TableCell className="py-4">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md border shadow-2xs",
                            c.source?.toLowerCase() === 'organic' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:bg-emerald-950 dark:text-emerald-400",
                            c.source?.toLowerCase() === 'referral' && "bg-purple-500/10 text-purple-600 border-purple-500/10 dark:bg-purple-950 dark:text-purple-400",
                            (!c.source || (c.source?.toLowerCase() !== 'organic' && c.source?.toLowerCase() !== 'referral')) && "bg-blue-500/10 text-blue-600 border-blue-500/10 dark:bg-blue-950 dark:text-blue-400"
                          )}
                        >
                          <span className={cn(
                            "h-1 w-1 rounded-full mr-1.5 inline-block",
                            c.source?.toLowerCase() === 'organic' && "bg-emerald-500",
                            c.source?.toLowerCase() === 'referral' && "bg-purple-500",
                            (!c.source || (c.source?.toLowerCase() !== 'organic' && c.source?.toLowerCase() !== 'referral')) && "bg-blue-500"
                          )} />
                          {c.source || 'Direct'}
                        </Badge>
                      </TableCell>

                      {/* Ingested Date Cell */}
                      <TableCell className="pr-6 sm:pr-8 py-4 text-right text-muted-foreground font-semibold text-xs whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end bg-slate-50/80 dark:bg-slate-900/40 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800/40">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{formatDate(c.createdAt)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  /* Premium Crafted Empty State Layout View */
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center p-8 max-w-sm mx-auto">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-muted-foreground/60 mb-3.5 shadow-2xs">
                          <Users className="h-5 w-5 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground tracking-tight">No recent candidates found</h4>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          When candidate registration pathways capture incoming profiles, details will populate this live logs table feed instantly.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}