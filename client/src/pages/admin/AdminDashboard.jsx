import { useQuery } from '@tanstack/react-query';
import { Users, School, Package, TrendingUp, Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { getSuperAdminDashboard } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="space-y-6 p-6 md:p-8 max-w-[1400px] mx-auto w-full animate-pulse">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full antialiased">
      
      {/* Upper Header Frame */}
      <div className="flex items-center justify-between border-b border-slate-200/50 pb-5 dark:border-slate-900">
        <PageHeader title="Dashboard" className="tracking-tight text-slate-800 dark:text-white font-bold" />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => refetch()} 
          disabled={isFetching}
          className="h-9 w-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-[#A05AFF] dark:bg-slate-900 dark:border-slate-800 shadow-xs group/btn active:scale-95 transition-all duration-200"
          title="Refresh Data"
        >
          <RefreshCcw className={cn(
            "h-3.5 w-3.5 transition-transform ease-in-out duration-500 group-hover/btn:rotate-180", 
            isFetching && "animate-spin text-[#A05AFF]"
          )} />
        </Button>
      </div>

      {/* Colorful Purple Theme Metric Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Schools - Coral/Pink Gradient */}
        <div className="rounded-xl bg-gradient-to-r from-[#FE9496] to-[#ff7b8f] p-6 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 text-white">
          <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Total Schools</span>
            <School className="h-5 w-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight relative z-10">
            {data?.totalSchools ? data.totalSchools.toLocaleString() : 0}
          </p>
          <p className="text-[11px] mt-2 text-white/70 relative z-10">Increased by 60%</p>
        </div>

        {/* Active Schools - Ocean Blue Gradient */}
        <div className="rounded-xl bg-gradient-to-r from-[#4BCBEB] to-[#3aa8cc] p-6 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 text-white">
          <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Active Schools</span>
            <School className="h-5 w-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight relative z-10">
            {data?.activeSchools ? data.activeSchools.toLocaleString() : 0}
          </p>
          <p className="text-[11px] mt-2 text-white/70 relative z-10">Decreased by 10%</p>
        </div>

        {/* Total Candidates - Mint Teal Gradient */}
        <div className="rounded-xl bg-gradient-to-r from-[#1BCFB4] to-[#14b39b] p-6 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 text-white">
          <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Total Candidates</span>
            <Users className="h-5 w-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight relative z-10">
            {data?.totalCandidates ? data.totalCandidates.toLocaleString() : 0}
          </p>
          <p className="text-[11px] mt-2 text-white/70 relative z-10">Increased by 5%</p>
        </div>

        {/* Active Plans - Royal Purple Gradient */}
        <div className="rounded-xl bg-gradient-to-r from-[#A05AFF] to-[#8644e3] p-6 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 text-white">
          <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Active Plans</span>
            <Package className="h-5 w-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight relative z-10">
            {data?.totalPlans ? data.totalPlans.toLocaleString() : 0}
          </p>
          <p className="text-[11px] mt-2 text-white/70 relative z-10">Active Packages</p>
        </div>

      </div>

      {/* Table Section */}
      <Card className="border border-none bg-white shadow-sm rounded-xl overflow-hidden mt-4 dark:bg-slate-900">
        <CardHeader className="p-5 flex flex-row items-center justify-between border-b border-slate-100 bg-white dark:bg-slate-900/50 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">
              Recent Candidates Statistics
            </CardTitle>
          </div>
          <Badge className="px-2 py-0.5 bg-[#1BCFB4]/10 hover:bg-[#1BCFB4]/20 text-[#1BCFB4] dark:bg-emerald-950/60 border border-transparent font-semibold text-[10px] tracking-wide rounded-md flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1BCFB4] animate-pulse" />
            Live Influx
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800">
                <TableRow>
                  <TableHead className="pl-6 font-semibold text-[11px] tracking-wider uppercase text-slate-400 dark:text-slate-500 py-3">Candidate Profile</TableHead>
                  <TableHead className="font-semibold text-[11px] tracking-wider uppercase text-slate-400 dark:text-slate-500 py-3">Target Position</TableHead>
                  <TableHead className="font-semibold text-[11px] tracking-wider uppercase text-slate-400 dark:text-slate-500 py-3">Acquisition Source</TableHead>
                  <TableHead className="pr-6 text-right font-semibold text-[11px] tracking-wider uppercase text-slate-400 dark:text-slate-500 py-3">Ingest Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentCandidates && data.recentCandidates.length > 0 ? (
                  data.recentCandidates.map((c, index) => {
                    const isSelf = c.source?.toLowerCase() === 'self_applicant';
                    const isImport = c.source?.toLowerCase() === 'super_admin_import';

                    return (
                      <TableRow 
                        key={c._id} 
                        style={{ animationDelay: `${index * 40}ms` }}
                        className="group transition-all duration-150 border-b border-slate-100 last:border-none dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                      >
                        {/* Name Avatar Cell */}
                        <TableCell className="pl-6 py-3.5 font-medium text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9E58FF]/10 text-[#9E58FF] text-xs font-bold group-hover:bg-[#A05AFF] group-hover:text-white transition-all duration-200">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="truncate max-w-[180px] font-semibold text-slate-700 dark:text-slate-200 tracking-tight group-hover:text-[#A05AFF] dark:group-hover:text-indigo-400 transition-colors duration-200">{c.fullName}</span>
                              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#A05AFF] shrink-0 hidden sm:inline-block" />
                            </div>
                          </div>
                        </TableCell>

                        {/* Position Tag Cell */}
                        <TableCell className="py-3.5 text-slate-600 dark:text-slate-300 font-medium text-sm">
                          <span className="inline-flex items-center rounded-lg bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200/30 dark:border-slate-700/50">
                            {c.position}
                          </span>
                        </TableCell>

                        {/* Acquisition Source Dynamic Badge */}
                        <TableCell className="py-3.5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-2 py-0.5 font-medium tracking-wide text-[10px] uppercase rounded-md border bg-transparent",
                              isSelf && "text-[#1BCFB4] border-[#1BCFB4]/40 bg-[#1BCFB4]/5",
                              isImport && "text-[#FE9496] border-[#FE9496]/40 bg-[#FE9496]/5",
                              (!isSelf && !isImport) && "text-[#4BCBEB] border-[#4BCBEB]/40 bg-[#4BCBEB]/5"
                            )}
                          >
                            {c.source ? c.source.replace(/_/g, ' ') : 'Direct'}
                          </Badge>
                        </TableCell>

                        {/* Ingest Date Cell */}
                        <TableCell className="pr-6 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end text-slate-400 dark:text-slate-500">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="text-[11px] font-medium">{formatDate(c.createdAt)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center">
                      <p className="text-xs font-medium text-slate-400">No recent candidates found</p>
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