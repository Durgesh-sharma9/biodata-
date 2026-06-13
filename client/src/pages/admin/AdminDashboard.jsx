import { useQuery } from '@tanstack/react-query';
import { Users, School, Package, TrendingUp, Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { getSuperAdminDashboard } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getSuperAdminDashboard().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto antialiased bg-slate-50/50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* Upper Header Frame - Clean Title with Small Refresh Button (Description Removed) */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-6 dark:border-slate-800">
        <PageHeader title="Dashboard" />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => refetch()} 
          disabled={isFetching}
          className="h-9 w-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-900 dark:border-slate-800 shadow-xs group/btn active:scale-90 transition-all duration-200"
          title="Refresh Data"
        >
          <RefreshCcw className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-500 group-hover/btn:rotate-180", 
            isFetching && "animate-spin text-indigo-500"
          )} />
        </Button>
      </div>

      {/* Highly Animated & Ultra Colorful Custom Multi-Accent Gradients Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Schools - Indigo/Blue Soft Gradient */}
        <div className="rounded-2xl border border-blue-300/40 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-5 shadow-sm text-white relative overflow-hidden group hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 animate-in slide-in-from-top-4">
          <div className="absolute -right-2 -top-2 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out">
            <School className="h-24 w-24 stroke-[1]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100/80 group-hover:translate-x-1 transition-transform duration-300">Total Schools</p>
          <p className="text-3xl font-black mt-1 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.totalSchools || 0}</p>
        </div>

        {/* Active Schools - Emerald/Teal Soft Gradient */}
        <div className="rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-5 shadow-sm text-white relative overflow-hidden group hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99] transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 animate-in slide-in-from-top-4 delay-75">
          <div className="absolute -right-2 -top-2 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out">
            <School className="h-24 w-24 stroke-[1]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/80 group-hover:translate-x-1 transition-transform duration-300">Active Schools</p>
          <p className="text-3xl font-black mt-1 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.activeSchools || 0}</p>
        </div>

        {/* Total Candidates - Violet/Purple Soft Gradient */}
        <div className="rounded-2xl border border-purple-300/40 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 p-5 shadow-sm text-white relative overflow-hidden group hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.99] transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 animate-in slide-in-from-top-4 delay-100">
          <div className="absolute -right-2 -top-2 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out">
            <Users className="h-24 w-24 stroke-[1]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-100/80 group-hover:translate-x-1 transition-transform duration-300">Total Candidates</p>
          <p className="text-3xl font-black mt-1 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.totalCandidates || 0}</p>
        </div>

        {/* Active Plans - Amber/Orange Soft Gradient */}
        <div className="rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-5 shadow-sm text-white relative overflow-hidden group hover:scale-[1.03] hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 animate-in slide-in-from-top-4 delay-150">
          <div className="absolute -right-2 -top-2 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out">
            <Package className="h-24 w-24 stroke-[1]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-100/80 group-hover:translate-x-1 transition-transform duration-300">Active Plans</p>
          <p className="text-3xl font-black mt-1 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.totalPlans || 0}</p>
        </div>

      </div>

      {/* Table Section - Premium Spacing with Dynamic Light Colorful Row Backgrounds */}
      <Card className="border border-slate-200/80 bg-white shadow-2xs rounded-xl overflow-hidden mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <CardHeader className="p-5 flex flex-row items-center justify-between border-b border-slate-200/60 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">
              Recent Candidates
            </CardTitle>
          </div>
          <Badge className="px-2.5 py-1 bg-indigo-600 text-white border-none font-bold text-[10px] tracking-wide rounded-md uppercase shadow-xs flex items-center gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Live Stream
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-100/80 border-b border-slate-200/60">
                <TableRow>
                  <TableHead className="pl-6 font-extrabold text-[11px] tracking-wider uppercase text-slate-600 py-3.5">Candidate Profile</TableHead>
                  <TableHead className="font-extrabold text-[11px] tracking-wider uppercase text-slate-600 py-3.5">Target Position</TableHead>
                  <TableHead className="font-extrabold text-[11px] tracking-wider uppercase text-slate-600 py-3.5">Acquisition Source</TableHead>
                  <TableHead className="pr-6 text-right font-extrabold text-[11px] tracking-wider uppercase text-slate-600 py-3.5">Ingest Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white">
                {data?.recentCandidates && data.recentCandidates.length > 0 ? (
                  data.recentCandidates.map((c, index) => {
                    const isSelf = c.source?.toLowerCase() === 'self_applicant';
                    const isImport = c.source?.toLowerCase() === 'super_admin_import';

                    return (
                      <TableRow 
                        key={c._id} 
                        style={{ animationDelay: `${index * 50}ms` }}
                        className={cn(
                          "group transition-all duration-200 last:border-none animate-in fade-in slide-in-from-left-2",
                          // Assigning elegant light background tones per source role dynamically
                          isSelf && "bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20",
                          isImport && "bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-950/20",
                          (!isSelf && !isImport) && "bg-blue-50/40 hover:bg-blue-50/80 dark:bg-indigo-950/10"
                        )}
                      >
                        {/* Name Avatar Cell */}
                        <TableCell className="pl-6 py-4 font-semibold text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black shadow-2xs group-hover:scale-110 transition-all duration-200">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="truncate max-w-[180px] font-bold text-slate-700 dark:text-slate-200 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">{c.fullName}</span>
                              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500 shrink-0 hidden sm:inline-block" />
                            </div>
                          </div>
                        </TableCell>

                        {/* Position Colorful Tag Cell */}
                        <TableCell className="py-4 font-medium text-sm">
                          <span className="inline-flex items-center rounded-md bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200/60 shadow-2xs group-hover:border-slate-300 transition-colors">
                            {c.position}
                          </span>
                        </TableCell>

                        {/* Acquisition Source Dynamic Colorful Badge */}
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md border bg-white shadow-2xs",
                              isSelf && "text-emerald-700 border-emerald-200",
                              isImport && "text-amber-700 border-amber-200",
                              (!isSelf && !isImport) && "text-sky-700 border-sky-200"
                            )}
                          >
                            {c.source ? c.source.replace(/_/g, ' ') : 'Direct'}
                          </Badge>
                        </TableCell>

                        {/* Ingest Date Cell */}
                        <TableCell className="pr-6 py-4 text-right text-slate-400 font-semibold text-xs whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                            <Calendar className="h-3 w-3 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
                            <span className="text-slate-500 font-bold text-[11px]">{formatDate(c.createdAt)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
                        <h4 className="text-xs font-bold text-slate-700">No recent candidates found</h4>
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