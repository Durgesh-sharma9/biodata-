import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, Coins, Plus, List, Search, ArrowRight, Sparkles, Loader2, 
  Briefcase, Eye, MapPin, GraduationCap, Phone, UserCheck, TrendingUp,
  PieChart, BarChart3, Target, ShieldCheck, CheckCircle2, Award, Zap
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
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 antialiased bg-[#f3f3f4]">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#A05AFF] animate-spin relative z-10" />
          <div className="absolute inset-0 bg-[#A05AFF]/10 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 font-bold tracking-wide text-sm">
          Assembling recruitment control center...
        </p>
      </div>
    );
  }

  const recentCandidates = data?.recentCandidates || [];
  const recentTalentPool = data?.recentTalentPool || [];
  const positionBreakdown = data?.positionBreakdown || [];
  const totalCandidates = data?.totalCandidates || 1;

  // Colors for Position Analytics Bars
  const BAR_COLORS = [
    'bg-[#A05AFF]',
    'bg-[#07cdae]',
    'bg-[#3081e4]',
    'bg-[#fe7096]',
    'bg-amber-500',
    'bg-indigo-500',
  ];

  return (
    <div className="space-y-6 w-full antialiased text-[#343a40]">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-5 py-3.5 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#A05AFF] text-white rounded-lg shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Recruitment Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium">Real-time Pipeline Analytics & Candidate Management</p>
          </div>
        </div>
        
        {/* Quick Action Group */}
        <div className="flex items-center gap-3">
          <Button asChild className="h-9 rounded-md bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-semibold shadow-sm transition-all text-xs px-4">
            <Link to="/candidates/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Candidate
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-9 rounded-md border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#A05AFF] transition-all text-xs px-4">
            <Link to="/talent-pool">
              <Search className="mr-1.5 h-3.5 w-3.5 text-[#4BCBEB]" /> Browse Pool
            </Link>
          </Button>
        </div>
      </div>

      {/* COMPACT Grid Matrix of Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* My Candidates */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ffbf96] to-[#fe7096] p-4 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <Users className="h-20 w-20" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">My Candidates</span>
              <h3 className="text-2xl font-bold tracking-tight">{data?.myCandidates || 0}</h3>
              <p className="text-[11px] opacity-80 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Active Pipeline Roster
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Talent Pool Records */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#84d9d2] to-[#07cdae] p-4 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <List className="h-20 w-20" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">Talent Pool Records</span>
              <h3 className="text-2xl font-bold tracking-tight">{data?.talentPoolCount || 0}</h3>
              <p className="text-[11px] opacity-80 font-medium flex items-center gap-1">
                <Search className="h-3 w-3" /> Discoverable Profiles
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm">
              <List className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Owned Candidates */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#90caf9] via-[#64b5f6] to-[#3081e4] p-4 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <Briefcase className="h-20 w-20" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">Owned Candidates</span>
              <h3 className="text-2xl font-bold tracking-tight">{data?.ownedCandidates || 0}</h3>
              <p className="text-[11px] opacity-80 font-medium flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> Direct Database Records
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Available Credits */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#da8eff] to-[#9e58ff] p-4 text-white shadow-sm group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15 pointer-events-none transition-transform duration-300 group-hover:scale-110">
            <Coins className="h-20 w-20" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">Available Credits</span>
              <h3 className="text-2xl font-bold tracking-tight">{data?.availableCredits || 0}</h3>
              <p className="text-[11px] opacity-80 font-medium flex items-center gap-1">
                <Coins className="h-3 w-3" /> Profile Unlock Balance
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm">
              <Coins className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* NEW ANALYTICS WIDGETS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Position Distribution Analytics Widget (2 Cols) */}
        <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 bg-white space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#A05AFF]" /> Candidate Distribution by Role
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

        {/* Pipeline Health & Performance Widget (1 Col) */}
        <Card className="border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="p-5 border-b border-slate-100 bg-white">
            <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#07cdae]" /> Pipeline Metrics
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Key indicators & account status</p>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/50 border border-teal-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Unlocked Profiles</h4>
                  <p className="text-[11px] text-slate-400">Total unlocked candidates</p>
                </div>
              </div>
              <span className="text-lg font-bold text-teal-700">{data?.unlockedCount || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#A05AFF] text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Search Radius</h4>
                  <p className="text-[11px] text-slate-400">Nearby candidate radius</p>
                </div>
              </div>
              <span className="text-sm font-bold text-purple-700">50 km</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Account Plan</h4>
                  <p className="text-[11px] text-slate-400">Subscription Tier</p>
                </div>
              </div>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">Premium</span>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* EXPANDED & RICH Recent My Candidates Datagrid */}
      <Card className="w-full border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 bg-white space-y-0">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#A05AFF]" /> My Candidates Pipeline ({recentCandidates.length} Shown)
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Full details of candidates in your school roster</p>
          </div>
          <Button variant="ghost" asChild className="h-8 text-xs font-bold text-[#A05AFF] hover:bg-[#A05AFF]/10 rounded-md transition-all px-3">
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
                          <Users className="h-6 w-6 text-[#A05AFF]" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-slate-700">No candidates logged yet</h4>
                          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                            Add candidate profiles to track and manage your recruitment pipeline.
                          </p>
                        </div>
                        <Button size="sm" asChild className="rounded-md bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-semibold px-4 h-8 text-xs">
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
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#A05AFF]/20 to-purple-500/20 text-[#A05AFF] font-bold text-xs flex items-center justify-center border border-[#A05AFF]/30 shrink-0">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <Link 
                                to={`/candidates/${c._id}`} 
                                className="font-bold text-slate-800 text-sm hover:text-[#A05AFF] transition-colors focus:outline-none hover:underline"
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
                            <span className="inline-block border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] font-semibold rounded-md px-2 py-0.5 text-[11px]">
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
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#A05AFF] hover:bg-[#A05AFF]/10">
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

      {/* SECONDARY RICH WIDGET: Recent Talent Pool Additions */}
      {recentTalentPool.length > 0 && (
        <Card className="w-full border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 bg-white space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold tracking-wide text-slate-800 flex items-center gap-2">
                <Search className="h-4 w-4 text-[#07cdae]" /> Latest Talent Pool Discoveries ({recentTalentPool.length} Shown)
              </CardTitle>
              <p className="text-xs text-slate-400 font-medium">Candidates looking for opportunities in the public pool</p>
            </div>
            <Button variant="ghost" asChild className="h-8 text-xs font-bold text-[#07cdae] hover:bg-[#07cdae]/10 rounded-md transition-all px-3">
              <Link to="/talent-pool" className="flex items-center gap-1">
                Explore Talent Pool <ArrowRight className="h-3.5 w-3.5" />
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
                      Position
                    </TableHead>
                    <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                      Location
                    </TableHead>
                    <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                      Qualification
                    </TableHead>
                    <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider h-11">
                      Experience
                    </TableHead>
                    <TableHead className="text-slate-700 font-bold text-[11px] uppercase tracking-wider pr-6 h-11 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTalentPool.map((c) => {
                    const locationStr = formatCandidateLocation(c);
                    const quals = Array.isArray(c.qualifications) && c.qualifications.length > 0 ? c.qualifications.join(', ') : '—';
                    const expStr = c.experienceYears !== undefined && c.experienceYears !== null ? `${c.experienceYears} Yrs` : '0 Yrs';

                    return (
                      <TableRow key={c._id} className="hover:bg-slate-50/70 transition-all border-b border-slate-100 last:border-none">
                        <TableCell className="pl-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-teal-50 text-[#07cdae] font-bold text-xs flex items-center justify-center border border-teal-200 shrink-0">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">
                              {c.fullName}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3 text-xs font-semibold text-slate-700">
                          {c.position || '—'}
                        </TableCell>

                        <TableCell className="py-3 text-xs font-medium text-slate-600">
                          {locationStr}
                        </TableCell>

                        <TableCell className="py-3 text-xs font-medium text-slate-600">
                          {quals}
                        </TableCell>

                        <TableCell className="py-3 text-xs font-semibold text-slate-700">
                          {expStr}
                        </TableCell>

                        <TableCell className="py-3 pr-6 text-right">
                          {c.isLocked ? (
                            <span className="inline-block border border-amber-300 bg-amber-50 text-amber-700 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                              Locked Profile
                            </span>
                          ) : (
                            <span className="inline-block border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                              Unlocked
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}