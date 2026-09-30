import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, Plus, ArrowRight, Sparkles, Loader2, 
  Briefcase, Eye, GraduationCap, Phone, UserCheck,
  PieChart, BarChart3, QrCode, CheckCircle2, Award, Calendar,
  Clock, ChevronRight, Inbox, BookmarkCheck, MessageCircle, 
  Search, ShieldCheck
} from 'lucide-react';
import { getDashboardStats } from '@/lib/api';
import { Button } from '@/components/ui/button';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { formatCandidateLocation } from '@/lib/location';

/* ─────────────────────────────────────────────────────────────
   Executive Subject Breakdown Donut Chart (Pure SVG)
   ───────────────────────────────────────────────────────────── */
function SubjectDonutChart({ segments = [], totalLabel = 'Total', totalValue = 0 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || totalValue || 0;

  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~339.29

  let accumulatedLength = 0;
  const computedSegments = segments.map((seg) => {
    const val = seg.value || 0;
    const ratio = total > 0 ? val / total : 0;
    const dashLength = ratio * circumference;
    const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
    const strokeDashoffset = -accumulatedLength;
    accumulatedLength += dashLength;

    return {
      ...seg,
      percentage: total > 0 ? Math.round(ratio * 100) : 0,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-3.5">
      {/* Central SVG Ring */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 150 150"
          className="w-36 h-36 sm:w-40 sm:h-40 -rotate-90 transform"
        >
          {/* Background Track */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Slices */}
          {total > 0 ? (
            computedSegments.map((seg, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <circle
                  key={idx}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })
          ) : (
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke="#CBD5E1"
              strokeWidth={strokeWidth}
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {hoveredIndex !== null ? computedSegments[hoveredIndex].value : totalValue}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {hoveredIndex !== null ? computedSegments[hoveredIndex].label : totalLabel}
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className="w-full space-y-1.5 pt-1">
        {total === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">No candidate subjects recorded yet.</p>
        ) : (
          computedSegments.slice(0, 4).map((seg, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  isHovered
                    ? 'bg-slate-100/90 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-2xs'
                    : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {seg.value}
                  </span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">
                    {seg.percentage}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Executive Dashboard Page (Pipeline & Subject Focused)
   ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStats().then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 antialiased bg-[#F4F7F6] dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-[#0F766E] animate-spin relative z-10" />
          <div className="absolute inset-0 bg-[#0F766E]/15 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-wide text-xs">
          Loading school recruitment desk...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-xs text-center">
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">
          Unable to load dashboard data
        </p>
        <p className="text-xs text-slate-500 mb-4">
          {error?.response?.data?.message || error?.message || 'Server connection error'}
        </p>
        <Button onClick={() => refetch()} className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  const recentCandidates = data?.recentCandidates || [];
  const positionBreakdown = data?.positionBreakdown || [];
  const totalCandidates = data?.myCandidates || 0;
  const directApplications = data?.directApplications || 0;
  const bEdCount = data?.bEdCount || 0;
  const bEdPercentage = data?.bEdPercentage || (totalCandidates > 0 ? Math.round((bEdCount / totalCandidates) * 100) : 0);
  const manualWalkIns = Math.max(0, totalCandidates - directApplications);
  const experienceBreakdown = data?.experienceBreakdown || [];

  // Pipeline Stage Counts (100% Real from School DB)
  const pipeline = data?.pipeline || {};
  const newApplications = pipeline.new ?? recentCandidates.filter((c) => c.status === 'new').length;
  const shortlisted = pipeline.shortlisted ?? data?.shortlistedCount ?? 0;
  const demoInterview = pipeline.interview ?? 0;
  const hired = pipeline.hired ?? 0;

  // Donut Colors for Subject Categories
  const SUBJECT_COLORS = ['#0F766E', '#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];

  // Subject Donut Segments (Pure Real Data from Position Breakdown)
  const subjectSegments = (positionBreakdown || []).map((p, idx) => ({
    label: p.position || 'General Staff',
    value: p.count || 0,
    color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
  }));

  return (
    <div className="space-y-4 sm:space-y-5 w-full antialiased text-slate-800 dark:text-slate-100 pb-16">
      
      {/* ─── 1. TOP HEADER: Clean Recruiter Desk Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xs border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white rounded-xl shadow-xs shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                Teacher Recruitment Desk
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#0F766E] dark:bg-teal-950/40 dark:text-[#2DD4BF] border border-teal-200/60 shrink-0">
                {totalCandidates} Total Biodatas
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
              Manage incoming applications, demo interviews & teacher selections
            </p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button asChild className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:from-[#0D9488] hover:to-[#0F766E] text-white font-bold text-xs shadow-xs transition-all cursor-pointer">
            <Link to="/candidates/new" className="flex items-center justify-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Biodata</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-teal-50/50 hover:text-[#0F766E] hover:border-[#0F766E]/40 text-xs font-semibold transition-all cursor-pointer">
            <Link to="/application-links" className="flex items-center justify-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-[#0F766E]" />
              <span>QR & Apply Links</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── 2. THE 4 RECRUITMENT PIPELINE STAGES (Compact & Real-Time) ─── */}
      <div className="grid gap-2.5 sm:gap-3 grid-cols-2 lg:grid-cols-4">
        
        {/* Stage 1: Total Biodatas */}
        <Link 
          to="/my-candidates"
          className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-teal-500 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              1. Total Biodatas
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#0F766E] dark:text-[#2DD4BF] group-hover:scale-105 transition-transform">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalCandidates}
            </h3>
            <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1 truncate">
              <UserCheck className="h-2.5 w-2.5" /> All School Records
            </p>
          </div>
        </Link>

        {/* Stage 2: Shortlisted */}
        <Link 
          to="/my-candidates?status=shortlisted"
          className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-[#0F766E] hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              2. Shortlisted
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[#0F766E] dark:text-[#2DD4BF] group-hover:scale-105 transition-transform">
              <BookmarkCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {shortlisted}
            </h3>
            <p className="text-[10px] text-[#0F766E] dark:text-[#2DD4BF] font-semibold flex items-center gap-1 truncate">
              <UserCheck className="h-2.5 w-2.5" /> Ready for Department Call
            </p>
          </div>
        </Link>

        {/* Stage 3: Demo & Interview Scheduled */}
        <Link 
          to="/my-candidates?status=interview_scheduled"
          className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              3. Demo & Interview
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {demoInterview}
            </h3>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 truncate">
              <Users className="h-2.5 w-2.5" /> Class Demo or Panel Round
            </p>
          </div>
        </Link>

        {/* Stage 4: Selected / Hired */}
        <Link 
          to="/my-candidates?status=hired"
          className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              4. Selected / Hired
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {hired}
            </h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 truncate">
              <CheckCircle2 className="h-2.5 w-2.5" /> Joined School Faculty
            </p>
          </div>
        </Link>

      </div>

      {/* ─── 3. SECOND ROW: Subject / Department Breakdown (Donut + Bars) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Column (5 cols): Subject Distribution Donut */}
        <Card className="lg:col-span-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col justify-between">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#0F766E]" />
                Subject & Role Split
              </CardTitle>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Teacher candidate pool by designation
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {positionBreakdown.length} Subjects
            </span>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
            <SubjectDonutChart
              segments={subjectSegments}
              totalLabel="Biodatas"
              totalValue={totalCandidates}
            />
          </CardContent>
        </Card>

        {/* Right Column (7 cols): Subject Pool Strength & Source Snapshot */}
        <Card className="lg:col-span-7 border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col justify-between">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#14B8A6]" />
                Subject Pool Strength
              </CardTitle>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Available teacher biodatas for each department
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              Faculty Pool
            </span>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {positionBreakdown.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-xs font-semibold">No positions logged yet.</p>
                  <Button size="sm" asChild className="mt-3 bg-[#0F766E] text-white text-xs rounded-xl">
                    <Link to="/candidates/new">+ Add First Teacher</Link>
                  </Button>
                </div>
              ) : (
                positionBreakdown.slice(0, 5).map((item, idx) => {
                  const percentage = totalCandidates > 0 ? Math.round((item.count / totalCandidates) * 100) : 0;
                  const barColor = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];

                  return (
                    <div key={item.position} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300 truncate">{item.position}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {item.count} {item.count === 1 ? 'candidate' : 'candidates'} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700" 
                          style={{ width: `${Math.min(100, Math.max(8, percentage))}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Channel & Compliance Pills */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">QR Links</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{directApplications}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Walk-ins</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{manualWalkIns}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800 text-center">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">B.Ed Certified</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">{bEdCount} ({bEdPercentage}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ─── 4. DIRECT ACTION CANDIDATE ROSTER (Quick Call / WhatsApp / Review) ─── */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-2xs rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0F766E]" />
              Direct Action Candidate Pipeline
            </CardTitle>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              Review candidate credentials, initiate calls, or schedule demo classes
            </p>
          </div>
          <Button variant="ghost" asChild className="h-8 px-3 text-xs font-bold text-[#0F766E] hover:bg-[#0F766E]/10 rounded-xl transition-all">
            <Link to="/my-candidates" className="flex items-center gap-1">
              <span>View All ({totalCandidates})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentCandidates.length === 0 ? (
            <div className="py-14 text-center text-slate-400 space-y-2">
              <p className="text-xs font-semibold">No teacher applications logged yet.</p>
              <Button size="sm" asChild className="bg-[#0F766E] text-white text-xs rounded-xl shadow-xs">
                <Link to="/candidates/new">+ Enter First Biodata</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentCandidates.slice(0, 6).map((c) => {
                const locationStr = formatCandidateLocation(c);
                const isLink = c.source === 'SCHOOL_LINK';
                const cleanPhone = c.mobile ? c.mobile.replace(/\D/g, '') : '';
                const waUrl = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}` : null;

                // Status chip styling
                let statusLabel = 'New';
                let statusClass = 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400';
                if (c.status === 'shortlisted') {
                  statusLabel = 'Shortlisted';
                  statusClass = 'bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-400';
                } else if (c.status === 'interview_scheduled' || c.status === 'demo_class') {
                  statusLabel = 'Demo / Interview';
                  statusClass = 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400';
                } else if (c.status === 'offered' || c.status === 'hired') {
                  statusLabel = 'Hired';
                  statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400';
                }

                return (
                  <div 
                    key={c._id}
                    className="p-3.5 sm:px-5 sm:py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Left: Avatar, Name, Subject, Qualifications */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] font-extrabold text-xs flex items-center justify-center border border-teal-200/60 dark:border-teal-800/50 shrink-0 shadow-2xs">
                        {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/candidates/${c._id}`}
                            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-[#0F766E] dark:hover:text-[#2DD4BF] truncate block transition-colors"
                          >
                            {c.fullName}
                          </Link>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusClass}`}>
                            {statusLabel}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.2 rounded-md">
                            {isLink ? 'QR Form' : 'Front Desk'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          <span className="text-slate-700 dark:text-slate-200 font-semibold">{c.position || 'Teacher'}</span>
                          <span>•</span>
                          <span>{c.experienceYears ? `${c.experienceYears} Yrs Exp` : 'Fresher'}</span>
                          {c.bEd && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold">B.Ed</span>
                            </>
                          )}
                          {locationStr && locationStr !== '—' && (
                            <>
                              <span>•</span>
                              <span className="truncate">{locationStr}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Direct Action Contact Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {c.mobile && (
                        <a
                          href={`tel:${c.mobile}`}
                          className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0F766E]/40 hover:bg-teal-50/50 text-slate-700 dark:text-slate-300 hover:text-[#0F766E] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                          title={`Call ${c.mobile}`}
                        >
                          <Phone className="h-3.5 w-3.5 text-[#0F766E]" />
                          <span className="hidden md:inline">{c.mobile}</span>
                        </a>
                      )}

                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                          title="Chat on WhatsApp"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366]" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}

                      <Button
                        size="sm"
                        asChild
                        className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <Link to={`/candidates/${c._id}`}>
                          <span>View Biodata</span>
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Link>
                      </Button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}