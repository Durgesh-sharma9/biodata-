import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, Plus, List, ArrowRight, Sparkles, Loader2, 
  Briefcase, Eye, MapPin, GraduationCap, Phone, UserCheck, TrendingUp,
  PieChart, BarChart3, Target, ShieldCheck, CheckCircle2, Award, Zap,
  Share2, Send, Clock, Flame, Activity, QrCode, BookmarkCheck, Calendar
} from 'lucide-react';
import { getDashboardStats } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { formatCandidateLocation } from '@/lib/location';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 antialiased bg-[#F4F7F6]">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#0F766E] animate-spin relative z-10" />
          <div className="absolute inset-0 bg-[#0F766E]/10 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 font-bold tracking-wide text-sm">
          Loading school recruitment dashboard...
        </p>
      </div>
    );
  }

  const recentCandidates = data?.recentCandidates || [];
  const positionBreakdown = data?.positionBreakdown || [];
  const totalCandidates = data?.myCandidates || data?.totalCandidates || 1;
  const directApplications = data?.directApplications || 0;
  const bEdCount = data?.bEdCount || 0;
  const bEdPercentage = data?.bEdPercentage || 0;
  const newThisMonth = data?.newThisMonth || 0;
  const shortlistedCount = data?.shortlistedCount || 0;
  const manualWalkIns = Math.max(0, (data?.myCandidates || 0) - directApplications);
  const experienceBreakdown = data?.experienceBreakdown || [];
  const topLocations = data?.topLocations || [];

  // Colors for Position Analytics Bars
  const BAR_COLORS = [
    'bg-[#0F766E]',
    'bg-[#07cdae]',
    'bg-[#3081e4]',
    'bg-[#fe7096]',
    'bg-amber-500',
    'bg-indigo-500',
  ];

  return (
    <div className="space-y-4 w-full antialiased text-[#1E293B]">
      
      {/* Top Header Row - Compact */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg shadow-2xs border border-[#E2EAE7] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#0F766E] text-white rounded-md shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">School Biodata Dashboard</h1>
            <p className="text-[11px] text-slate-400 font-medium">Manage teacher applications, walk-in biodatas & interview pipeline</p>
          </div>
        </div>
        
        {/* Quick Action Group */}
        <div className="flex items-center gap-2">
          <Button asChild className="h-8 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold shadow-2xs transition-all text-xs px-3">
            <Link to="/candidates/new">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Biodata
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-8 rounded-lg border-[#E2EAE7] bg-white text-slate-700 hover:bg-[#F0FDFA] hover:text-[#0F766E] hover:border-[#0F766E]/40 transition-all text-xs px-3">
            <Link to="/application-links">
              <QrCode className="mr-1.5 h-3.5 w-3.5 text-[#0F766E]" /> QR & Apply Links
            </Link>
          </Button>
        </div>
      </div>

      {/* COMPACT Grid Matrix of Statistics Cards - Teal & Mint Palette 2 */}
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Biodatas - Teal Gradient Accent Card */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#0F766E] to-[#14B8A6] p-3.5 text-white shadow-2xs group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <Users className="h-16 w-16" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold opacity-90 uppercase tracking-wider">Total Biodatas</span>
              <h3 className="text-2xl font-black tracking-tight">{data?.myCandidates || 0}</h3>
              <p className="text-[10px] opacity-90 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> School Candidate Roster
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-xs">
              <Users className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Direct Link Applications - Crisp White Card with Top Teal Accent */}
        <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-900 border border-[#E2EAE7] border-t-3 border-t-[#0F766E] dark:border-slate-800 p-3.5 shadow-2xs group">
          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">QR & Link Applies</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{directApplications}</h3>
              <p className="text-[10px] text-[#0F766E] font-semibold flex items-center gap-1">
                <QrCode className="h-3 w-3 text-[#14B8A6]" /> Self-Submitted by Teachers
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#0F766E]/10 text-[#0F766E]">
              <Share2 className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Walk-in Entries - Crisp White Card with Top Mint Accent */}
        <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-900 border border-[#E2EAE7] border-t-3 border-t-[#14B8A6] dark:border-slate-800 p-3.5 shadow-2xs group">
          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Walk-in & Manual</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{manualWalkIns}</h3>
              <p className="text-[10px] text-[#14B8A6] font-semibold flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Added by School Staff
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#14B8A6]/15 text-[#0F766E]">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Shortlisted Candidates - Warm Amber Alert Card */}
        <div className="relative overflow-hidden rounded-lg bg-[#FEF3C7]/90 dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-900/60 p-3.5 shadow-2xs group">
          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Shortlisted</span>
              <h3 className="text-2xl font-black text-amber-950 dark:text-amber-200 tracking-tight">{shortlistedCount}</h3>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                <BookmarkCheck className="h-3 w-3" /> Ready for Interview / Demo
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <BookmarkCheck className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY RECRUITMENT KPI CHIPS */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        
        {/* Direct Link Applicants */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Link Applies</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white">{directApplications}</h4>
            </div>
          </div>
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/30 px-2 py-0.5 rounded-md">
            School Link
          </span>
        </div>

        {/* B.Ed / Trained Staff */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">B.Ed / Trained</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white">{bEdCount}</h4>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
            {bEdPercentage}% of Pool
          </span>
        </div>

        {/* New Inflow (30 Days) */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New This Month</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white">{newThisMonth}</h4>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
            Active
          </span>
        </div>

        {/* Interview Outreaches Sent */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outreach Sent</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white">{interestSentCount}</h4>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
            Interview Inquiries
          </span>
        </div>

      </div>

      {/* MAIN ANALYTICS WIDGETS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Position Distribution Analytics Widget (2 Cols) */}
        <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 bg-white space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#0F766E]" /> Candidate Distribution by Role
              </CardTitle>
              <p className="text-xs text-slate-400 font-medium">Breakdown of active talent across position categories</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {totalCandidates} Total Records
            </span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {positionBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No position analytics available.</p>
            ) : (
              positionBreakdown.map((item, idx) => {
                const percentage = Math.round((item.count / totalCandidates) * 100) || 5;
                const barColor = BAR_COLORS[idx % BAR_COLORS.length];

                return (
                  <div key={item.position} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{item.position}</span>
                      <span className="text-slate-500">{item.count} candidates ({percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Pipeline Health & Status Widget (1 Col) */}
        <Card className="border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="p-5 border-b border-slate-100 bg-white">
            <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#07cdae]" /> School Pipeline Status
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Recruitment health & staff qualification metrics</p>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/50 border border-teal-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-600 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">B.Ed / Certified Ratio</h4>
                  <p className="text-[11px] text-slate-400">{bEdCount} qualified candidates</p>
                </div>
              </div>
              <span className="text-lg font-bold text-teal-700">{bEdPercentage}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0F766E] text-white">
                  <BookmarkCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Shortlisted for Demo</h4>
                  <p className="text-[11px] text-slate-400">Ready for interview panel</p>
                </div>
              </div>
              <span className="text-sm font-bold text-teal-800">{shortlistedCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white">
                  <QrCode className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">QR / Web Form Applies</h4>
                  <p className="text-[11px] text-slate-400">Direct paperless entries</p>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-700">{directApplications}</span>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* SECONDARY ANALYTICS: EXPERIENCE & REGIONAL TALENT + RECRUITMENT SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Experience & Regional Distribution */}
        <Card className="border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="p-5 border-b border-slate-100 bg-white space-y-0.5">
            <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-[#FF9F1C]" /> Experience & Regional Distribution
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Candidate seniority brackets & candidate locations</p>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            {/* Experience Buckets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Experience Level</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(experienceBreakdown.length > 0 ? experienceBreakdown : [
                  { label: 'Fresher (0 yr)', count: 0 },
                  { label: '1 - 2 Years', count: 0 },
                  { label: '3 - 5 Years', count: 0 },
                  { label: '5+ Years', count: 0 },
                ]).map((exp) => (
                  <div key={exp.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-lg font-black text-slate-800">{exp.count}</p>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">{exp.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Regional Hubs */}
            {topLocations.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#3081e4]" /> Top Candidate Locations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topLocations.map((loc) => (
                    <span 
                      key={loc.city} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50/70 border border-teal-100 text-xs font-semibold text-teal-800"
                    >
                      <MapPin className="h-3 w-3 text-[#0F766E]" />
                      {loc.city}: <strong className="font-bold">{loc.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recruitment Shortcuts & Tools */}
        <Card className="border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 bg-white space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#07cdae]" /> Quick Recruitment Tools
              </CardTitle>
              <p className="text-xs text-slate-400 font-medium">Fast access to everyday hiring tools</p>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <Link 
              to="/candidates/new" 
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-[#F0FDFA] border border-slate-100 hover:border-[#14B8A6]/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center font-bold">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0F766E]">Add Walk-in Biodata</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Enter a physical resume received at reception</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link 
              to="/application-links" 
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-[#F0FDFA] border border-slate-100 hover:border-[#14B8A6]/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#14B8A6]/15 text-[#0F766E] flex items-center justify-center font-bold">
                  <QrCode className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0F766E]">School QR Standee & Web Link</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Print reception QR standee or share direct form link</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link 
              to="/my-candidates" 
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-[#F0FDFA] border border-slate-100 hover:border-[#14B8A6]/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <List className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0F766E]">Manage Candidates Roster</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Filter by subject, experience, call candidates or print sheets</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </CardContent>
        </Card>

      </div>

      {/* EXPANDED & RICH Recent My Candidates Datagrid */}
      <Card className="w-full border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 bg-white space-y-0">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0F766E]" /> My Candidates Pipeline ({recentCandidates.length} Shown)
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Full details of candidates in your school roster</p>
          </div>
          <Button variant="ghost" asChild className="h-8 text-xs font-bold text-[#0F766E] hover:bg-[#0F766E]/10 rounded-md transition-all px-3">
            <Link to="/my-candidates" className="flex items-center gap-1">
              View all candidates <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100 bg-slate-50/50">
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider pl-6 h-11">
                    Candidate Name
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                    Mobile / Contact
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                    Position
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                    Location
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                    Qualification & Exp
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                    Source
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                    Date Added
                  </TableHead>
                  <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider pr-6 h-11 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCandidates.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="py-14 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl text-slate-400">
                          <Users className="h-6 w-6 text-[#0F766E]" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-700">No candidates logged yet</h4>
                          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                            Add candidate profiles to track and manage your recruitment pipeline.
                          </p>
                        </div>
                        <Button size="sm" asChild className="rounded-md bg-[#0F766E] hover:bg-[#0F766E]/90 text-white font-semibold px-4 h-8 text-xs">
                          <Link to="/candidates/new">Add First Candidate</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentCandidates.map((c) => {
                    const locationStr = formatCandidateLocation(c);
                    const quals = Array.isArray(c.qualifications) && c.qualifications.length > 0 ? c.qualifications.join(', ') : '';
                    const expStr = c.experienceYears !== undefined && c.experienceYears !== null ? `${c.experienceYears} Yrs` : '';
                    const qualExp = [quals, expStr].filter(Boolean).join(' • ');

                    return (
                      <TableRow key={c._id} className="hover:bg-slate-50/70 transition-all border-b border-slate-100 last:border-none">
                        {/* Candidate Name */}
                        <TableCell className="pl-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0F766E]/20 to-purple-500/20 text-[#0F766E] font-bold text-xs flex items-center justify-center border border-[#0F766E]/30 shrink-0">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <Link 
                                to={`/candidates/${c._id}`} 
                                className="font-bold text-slate-800 text-sm hover:text-[#0F766E] transition-colors focus:outline-none hover:underline"
                              >
                                {c.fullName}
                              </Link>
                              {c.gender && (
                                <p className="text-[11px] text-slate-400 font-medium capitalize">{c.gender}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Mobile / Contact */}
                        <TableCell className="py-3 text-xs font-semibold text-slate-600">
                          {c.mobile ? (
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              <Phone className="h-3 w-3 text-slate-400" /> {c.mobile}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>

                        {/* Position */}
                        <TableCell className="py-3 text-xs font-semibold">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                            {c.position || '—'}
                          </span>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="py-3 text-xs font-medium text-slate-600 max-w-[160px] truncate">
                          {locationStr !== '—' ? (
                            <span className="inline-flex items-center gap-1 truncate" title={locationStr}>
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> {locationStr}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>

                        {/* Qualification & Experience */}
                        <TableCell className="py-3 text-xs font-medium text-slate-600">
                          {qualExp ? (
                            <span className="inline-flex items-center gap-1">
                              <GraduationCap className="h-3 w-3 text-slate-400 shrink-0" /> {qualExp}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>

                        {/* Source */}
                        <TableCell className="py-3">
                          {c.source ? (
                            <span className="inline-block border border-[#0F766E]/30 bg-[#0F766E]/5 text-[#0F766E] font-semibold rounded-md px-2 py-0.5 text-[11px]">
                              {c.source.replace(/_/g, ' ')}
                            </span>
                          ) : (
                            <span className="inline-block border border-slate-200 bg-slate-50 text-slate-400 text-[11px] font-medium rounded-md px-2 py-0.5">
                              System Pool
                            </span>
                          )}
                        </TableCell>

                        {/* Date Added */}
                        <TableCell className="py-3 text-xs text-slate-500 font-medium">
                          {formatDate(c.createdAt)}
                        </TableCell>

                        {/* Action */}
                        <TableCell className="py-3 pr-6 text-right">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#0F766E] hover:bg-[#0F766E]/10">
                            <Link to={`/candidates/${c._id}`} title="View Candidate Details">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}