import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, Package, TrendingUp, Calendar, RefreshCcw, 
  ArrowRight, ShieldCheck, UploadCloud, FolderTree, SlidersHorizontal,
  ChevronRight, Award, Plus, CheckCircle2, UserCheck, Layers, Percent
} from 'lucide-react';
import { getSuperAdminDashboard } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getSuperAdminDashboard().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-5 w-full animate-pulse p-1 sm:p-2">
        <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl w-full" />
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-100 dark:bg-slate-800/40 rounded-2xl w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-xs text-center">
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">
          Unable to load Super Admin dashboard data
        </p>
        <p className="text-xs text-slate-500 mb-4">
          {error?.response?.data?.message || error?.message || 'Server connection error'}
        </p>
        <Button onClick={() => refetch()} className="bg-gradient-to-r from-[#8A3BD4] to-[#A855F7] text-white text-xs rounded-lg">
          Try Again
        </Button>
      </div>
    );
  }

  const totalSchools = data?.totalSchools || 0;
  const activeSchools = data?.activeSchools || 0;
  const totalCandidates = data?.totalCandidates || 0;
  const totalPlans = data?.totalPlans || 0;
  const recentCandidates = data?.recentCandidates || [];

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER: Clean Recruiter/Super Admin Desk Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-white dark:bg-slate-700 text-[#8A3BD4] dark:text-purple-300 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Super Admin Command Center
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-[#8A3BD4] dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 shrink-0">
                {totalSchools} Schools Registered
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/60 shrink-0">
                {totalCandidates} Candidates Total
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              Platform-wide administration, school accounts, token plans & candidate pools
            </p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button asChild className="flex-1 sm:flex-initial h-9 px-3.5 rounded-lg bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] hover:from-[#6D28D9] hover:via-[#7E22CE] hover:to-[#0284C7] text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all cursor-pointer border-none">
            <Link to="/admin/schools" className="flex items-center justify-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Manage Schools</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-cyan-50/50 hover:text-[#00D2FF] hover:border-[#00D2FF]/40 text-xs font-semibold transition-all cursor-pointer">
            <Link to="/admin/import" className="flex items-center justify-center gap-1.5">
              <UploadCloud className="h-3.5 w-3.5 text-[#00D2FF]" />
              <span>Import Candidates</span>
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()} 
            disabled={isFetching}
            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 shadow-2xs group/btn cursor-pointer shrink-0"
            title="Refresh Data"
          >
            <RefreshCcw className={cn(
              "h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:rotate-180", 
              isFetching && "animate-spin text-[#8A3BD4]"
            )} />
          </Button>
        </div>
      </div>

      {/* ─── 2. THE 4 PLATFORM METRIC CARDS (Soft Themed Gradients) ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Total Schools */}
        <Link 
          to="/admin/schools"
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FAF5FF] via-white to-purple-50/50 dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-2xs hover:border-[#8A3BD4] hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700/80 dark:text-purple-300 uppercase tracking-wider">
              1. Total Schools
            </span>
            <div className="p-1.5 rounded-lg bg-purple-100/80 dark:bg-purple-950/60 text-[#8A3BD4] dark:text-purple-300 group-hover:scale-105 transition-transform">
              <Building2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 dark:text-white tracking-tight">
              {totalSchools.toLocaleString()}
            </h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 truncate">
              <CheckCircle2 className="h-2.5 w-2.5" /> {activeSchools} Active Subscriptions
            </p>
          </div>
        </Link>

        {/* Card 2: Active Schools */}
        <Link 
          to="/admin/schools?status=active"
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] via-white to-teal-50/50 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/50 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-teal-700/80 dark:text-teal-300 uppercase tracking-wider">
              2. Active Institutions
            </span>
            <div className="p-1.5 rounded-lg bg-teal-100/80 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-white tracking-tight">
              {activeSchools.toLocaleString()}
            </h3>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 truncate">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 inline-block animate-pulse" /> Live System Access
            </p>
          </div>
        </Link>

        {/* Card 3: Platform Candidates */}
        <Link 
          to="/admin/import"
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#EFF6FF] via-white to-cyan-50/50 dark:bg-slate-900 border border-cyan-200/80 dark:border-cyan-900/50 shadow-2xs hover:border-[#00D2FF] hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-cyan-700/80 dark:text-cyan-300 uppercase tracking-wider">
              3. Total Candidates
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-100/80 dark:bg-cyan-950/60 text-[#00D2FF] dark:text-cyan-300 group-hover:scale-105 transition-transform">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalCandidates.toLocaleString()}
            </h3>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1 truncate">
              <UserCheck className="h-2.5 w-2.5" /> Central Candidate Vault
            </p>
          </div>
        </Link>

        {/* Card 4: Subscription Plans */}
        <Link 
          to="/admin/plans"
          className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#FFFBEB] via-white to-amber-50/50 dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 shadow-2xs hover:border-amber-500 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700/80 dark:text-amber-300 uppercase tracking-wider">
              4. Active Plans
            </span>
            <div className="p-1.5 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform">
              <Package className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 dark:text-white tracking-tight">
              {totalPlans.toLocaleString()}
            </h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 truncate">
              <Award className="h-2.5 w-2.5" /> School Pricing Bundles
            </p>
          </div>
        </Link>

      </div>

      {/* ─── 3. QUICK NAVIGATION PLATFORM TILES ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {[
          { label: 'Schools Directory', desc: 'Manage registered schools', to: '/admin/schools', icon: Building2, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' },
          { label: 'School Admins', desc: 'Staff credentials & credits', to: '/admin/admins', icon: ShieldCheck, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
          { label: 'Candidate Import', desc: 'Single & bulk CSV ingest', to: '/admin/import', icon: UploadCloud, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
          { label: 'Master Data', desc: 'Positions, subjects, classes', to: '/admin/master-data', icon: FolderTree, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50' },
          { label: 'Credit Packages', desc: 'Balance top-up packages', to: '/admin/credit-packages', icon: Percent, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50' },
          { label: 'Partner Marquee', desc: 'Hero & trust logo badges', to: '/admin/marquee', icon: SlidersHorizontal, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' },
        ].map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Link
              key={i}
              to={tile.to}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-[#8A3BD4]/40 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", tile.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-[#8A3BD4] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#8A3BD4] transition-colors leading-tight">
                  {tile.label}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {tile.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ─── 4. RECENT CANDIDATE INFLUX TABLE ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#8A3BD4]/10 text-[#8A3BD4] rounded-xl border border-purple-200/60 dark:border-purple-900/40">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recent Candidates Influx
              </CardTitle>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Latest biodata submissions and uploads across the entire platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 font-bold text-[10px] tracking-wide rounded-lg flex items-center gap-1.5 shadow-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Influx
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <TableRow>
                  <TableHead className="pl-5 font-bold text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400 py-3.5">Candidate Profile</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400 py-3.5">Target Position</TableHead>
                  <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400 py-3.5">Acquisition Source</TableHead>
                  <TableHead className="pr-5 text-right font-bold text-[11px] tracking-wider uppercase text-slate-500 dark:text-slate-400 py-3.5">Ingest Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCandidates && recentCandidates.length > 0 ? (
                  recentCandidates.map((c, index) => {
                    const isSelf = c.source?.toLowerCase() === 'self_applicant';
                    const isImport = c.source?.toLowerCase() === 'super_admin_import';

                    return (
                      <TableRow 
                        key={c._id || index} 
                        className="group transition-all duration-150 border-b border-slate-100 last:border-none dark:border-slate-800/60 hover:bg-purple-50/30 dark:hover:bg-slate-800/40"
                      >
                        {/* Name Avatar Cell */}
                        <TableCell className="pl-5 py-3.5 font-medium text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8A3BD4] to-[#A855F7] text-white text-xs font-extrabold shadow-2xs">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="min-w-0">
                              <span className="truncate block max-w-[200px] sm:max-w-[260px] font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-[#8A3BD4] transition-colors">
                                {c.fullName}
                              </span>
                              {c.email && (
                                <span className="text-[10.5px] text-slate-400 font-medium block truncate">
                                  {c.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Position Tag Cell */}
                        <TableCell className="py-3.5 text-slate-600 dark:text-slate-300 font-medium text-sm">
                          <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                            {c.position || 'General Staff'}
                          </span>
                        </TableCell>

                        {/* Acquisition Source Dynamic Badge */}
                        <TableCell className="py-3.5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-2.5 py-0.5 font-bold tracking-wide text-[10px] uppercase rounded-md border",
                              isSelf && "text-teal-700 border-teal-200 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
                              isImport && "text-blue-700 border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
                              (!isSelf && !isImport) && "text-purple-700 border-purple-200 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
                            )}
                          >
                            {c.source ? c.source.replace(/_/g, ' ') : 'Direct Walk-in'}
                          </Badge>
                        </TableCell>

                        {/* Ingest Date Cell */}
                        <TableCell className="pr-5 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-end text-slate-500 dark:text-slate-400 text-xs font-semibold">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{formatDate(c.createdAt)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center p-6 text-slate-400">
                        <Users className="h-8 w-8 stroke-[1.5] text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No candidates recorded yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Use the Candidate Import tool to ingest teacher and staff profiles</p>
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