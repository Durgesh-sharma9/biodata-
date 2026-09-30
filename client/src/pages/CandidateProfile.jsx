import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { 
  Pencil, FileText, ExternalLink, Lock, Send, Unlock, User, Briefcase, 
  FileCheck, ShieldAlert, BadgeInfo, CheckCircle2, Loader2, Sparkles, 
  Phone, MessageSquare, Mail, Printer, Star, Calendar, BookmarkCheck, Check
} from 'lucide-react';
import {
  getCandidate,
  updateCandidate,
  unlockCandidate,
  sendInterestRequest,
  getInterestRequestStatus,
  getPositions,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-800/60 py-3.5 last:border-0 group transition-colors">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 self-center">{label}</dt>
      <dd className="col-span-2 text-sm font-semibold text-slate-800 dark:text-slate-200 self-center break-words">{value || '-'}</dd>
    </div>
  );
}

const PIPELINE_STAGES = [
  { id: 'new', label: 'New Application', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:ring-blue-400' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 active:ring-teal-400' },
  { id: 'interview_scheduled', label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 active:ring-amber-400' },
  { id: 'demo_class', label: 'Demo Class', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 active:ring-indigo-400' },
  { id: 'offered', label: 'Offered', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 active:ring-purple-400' },
  { id: 'hired', label: 'Hired', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 active:ring-emerald-400 font-bold' },
  { id: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 active:ring-rose-400' },
];

export default function CandidateProfile() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { refreshSchool, school } = useAuth();
  const [interestForm, setInterestForm] = useState({ positionOffered: '', message: '' });
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState('new');
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [candidateRating, setCandidateRating] = useState(0);
  const [interviewDate, setInterviewDate] = useState('');

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
  });

  useEffect(() => {
    if (candidate) {
      setPipelineStatus(candidate.status || 'new');
      setInterviewerNotes(candidate.notes || '');
      setCandidateRating(candidate.rating || 0);
      setInterviewDate(
        candidate.interviewDate ? new Date(candidate.interviewDate).toISOString().slice(0, 16) : ''
      );
    }
  }, [candidate]);

  const updatePipelineMutation = useMutation({
    mutationFn: (customPayload) =>
      updateCandidate(id, {
        status: customPayload?.status ?? pipelineStatus,
        notes: customPayload?.notes ?? interviewerNotes,
        rating: customPayload?.rating ?? candidateRating,
        interviewDate: (customPayload?.interviewDate ?? interviewDate) || undefined,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData(['candidate', id], (prev) => ({
        ...prev,
        ...res.data.data,
      }));
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setStatusBanner({ type: 'success', message: 'Recruitment status & evaluation notes updated successfully!' });
    },
    onError: (err) => {
      setStatusBanner({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update candidate recruitment status',
      });
    },
  });

  const { data: positionsData } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const { data: interestStatus } = useQuery({
    queryKey: ['interest-status', id],
    queryFn: () => getInterestRequestStatus(id).then((r) => r.data.data),
    enabled: !!candidate?.canSendInterest,
  });

  const [statusBanner, setStatusBanner] = useState(null);

  const unlockMutation = useMutation({
    mutationFn: () => unlockCandidate(id),
    onSuccess: async (res) => {
      queryClient.setQueryData(['candidate', id], res.data.data);
      await refreshSchool();
      setStatusBanner({ type: 'success', message: 'Candidate contact details unlocked successfully!' });
    },
    onError: (err) => {
      setStatusBanner({ type: 'error', message: err.response?.data?.message || 'Failed to unlock profile. Please check your credit balance.' });
    },
  });

  const interestMutation = useMutation({
    mutationFn: () =>
      sendInterestRequest({
        candidateId: id,
        positionOffered: interestForm.positionOffered,
        message: interestForm.message,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interest-status', id] });
      setShowInterestForm(false);
      setStatusBanner({ type: 'success', message: 'Interest request sent to candidate successfully!' });
    },
    onError: (err) => {
      setStatusBanner({ type: 'error', message: err.response?.data?.message || 'Failed to send interest request' });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-5 max-w-7xl mx-auto animate-pulse">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
          <div className="h-96 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto p-5 animate-in fade-in duration-300">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 mb-3">
          <User className="h-5 w-5 stroke-[1.5]" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">Candidate Profile Missing</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
          The requested candidate asset could not be resolved across our global platform records index.
        </p>
      </div>
    );
  }

  const isLocked = candidate.isLocked;
  const isContactHidden = candidate.isContactHidden;
  const canViewProfileDetails = !isLocked;
  const hasSentInterest = !!interestStatus;

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    interestMutation.mutate();
  };

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      
      {statusBanner && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
          statusBanner.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' 
            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300'
        }`}>
          <span>{statusBanner.message}</span>
          <button onClick={() => setStatusBanner(null)} className="ml-4 opacity-70 hover:opacity-100 font-black">✕</button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-slate-200/60 dark:border-slate-800 pb-5 no-print">
        <PageHeader
          title={candidate.fullName}
          description={`${candidate.position}${candidate.source ? ` • ${candidate.source}` : ''} • Added ${formatDate(candidate.createdAt)}`}
        />
        
        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10 self-start md:self-auto">
          {/* Print Biodata Sheet for physical interview panel */}
          <Button 
            onClick={() => window.print()}
            className="h-11 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs gap-2 shadow-2xs transition-all active:scale-95"
            title="Print A4 Biodata Sheet for Interview Panel"
          >
            <Printer className="h-4 w-4" />
            <span>Print Biodata Sheet (A4)</span>
          </Button>

          {isLocked && (
            <Button 
              onClick={() => unlockMutation.mutate()} 
              disabled={unlockMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg h-11 px-5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {unlockMutation.isPending ? <Loader2 className="h-4 w-full animate-spin" /> : (
                <>
                  <Unlock className="h-4 w-4 stroke-[2.5]" />
                  <span>Unlock Profile (1 Credit)</span>
                </>
              )}
            </Button>
          )}
          {candidate.canEdit && (
            <Button 
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 gap-2 transition-all"
            >
              <Link to={`/candidates/${id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* RECRUITMENT PIPELINE & INTERVIEW EVALUATION CARD (School Owned / Direct Candidates) */}
      {candidate.canEdit && (
        <Card className="border border-[#E2EAE7] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs rounded-xl overflow-hidden no-print">
          <CardHeader className="p-4 border-b border-[#E2EAE7] dark:border-slate-800 bg-[#F4F7F6]/60 dark:bg-slate-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0F766E] text-white">
                  <BookmarkCheck className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Recruitment Pipeline & Evaluation</CardTitle>
                  <CardDescription className="text-xs text-slate-500">Track application stages, schedule demo/interview, and log private evaluation notes</CardDescription>
                </div>
              </div>
              
              {/* Star Rating Selector */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-[#E2EAE7] dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setCandidateRating(star);
                      updatePipelineMutation.mutate({ rating: star });
                    }}
                    className="p-0.5 hover:scale-110 transition-transform text-amber-400"
                    title={`${star} Star Rating`}
                  >
                    <Star 
                      className={`h-4 w-4 ${star <= candidateRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Interactive Pipeline Stage Selector Pills */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Pipeline Stage</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {PIPELINE_STAGES.map((stage) => {
                  const isActive = pipelineStatus === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => {
                        setPipelineStatus(stage.id);
                        updatePipelineMutation.mutate({ status: stage.id });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${stage.color} ${
                        isActive 
                          ? 'ring-2 ring-[#0F766E] shadow-xs scale-102 font-extrabold' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                      <span>{stage.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interview Date & Private Notes Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#0F766E]" /> Interview / Demo Date
                </Label>
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="h-10 text-xs border-[#E2EAE7] rounded-lg dark:bg-slate-800"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Private Interviewer Notes & Demo Feedback
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    value={interviewerNotes}
                    onChange={(e) => setInterviewerNotes(e.target.value)}
                    placeholder="Enter private school evaluation notes, subject test score, demo class review..."
                    className="text-xs border-[#E2EAE7] rounded-lg dark:bg-slate-800 min-h-[40px] h-10 resize-none py-2"
                  />
                  <Button
                    onClick={() => updatePipelineMutation.mutate()}
                    disabled={updatePipelineMutation.isPending}
                    className="h-10 px-4 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shrink-0 rounded-lg"
                  >
                    {updatePipelineMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save Note'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modern Soft-Tint Informational Banners */}
      {isLocked && (
        <div className="rounded-xl border border-rose-200/60 bg-rose-50/80 p-4 flex gap-3 text-xs font-semibold text-rose-600 leading-relaxed shadow-none animate-in slide-in-from-top-2 duration-300">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-rose-600 mb-0.5">Preview Mode Restrained</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Unlock this candidate node to reveal specialized academic qualifications, career history experience years, expected remuneration metrics, geographic placement coordinates, and portfolio documentation. Contact attributes remain safely masked for shared talent pool assets.</p>
          </div>
        </div>
      )}

      {canViewProfileDetails && isContactHidden && (
        <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/80 p-4 flex gap-3 text-xs font-semibold text-cyan-600 leading-relaxed shadow-none animate-in slide-in-from-top-2 duration-300">
          <BadgeInfo className="h-4 w-4 shrink-0 text-cyan-600 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-600 mb-0.5">Profile Gateway Unlocked</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Professional criteria metrics and verification files are now fully exposed. Core personal communication contact indices (mobile / email) remain securely protected until the applicant chooses to acknowledge or approve your outgoing platform Interest Request.</p>
          </div>
        </div>
      )}

      {/* Primary Data Columns Split View Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        
        {/* Basic Details Container */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 flex flex-col justify-between">
          <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-xl">
                <User className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Basic Details</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Identity parameters and geographic residence logs</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-5 flex-grow space-y-6">
            {/* Standard Circular Avatar Profile Component Frame */}
            <div className="flex justify-center pb-2">
              {candidate.profilePhoto ? (
                <div className="relative p-1 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <img
                    src={candidate.profilePhoto}
                    alt={candidate.fullName}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl font-bold">
                  {candidate.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            <dl className="divide-y divide-slate-100 dark:divide-slate-800/40">
              <DetailRow label="Full Name" value={candidate.fullName} />
              {candidate.gender && <DetailRow label="Gender" value={candidate.gender} />}
              {!isContactHidden && (
                <DetailRow
                  label="Mobile"
                  value={
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{candidate.mobile}</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${candidate.mobile}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 transition-colors"
                          title="Call Candidate"
                        >
                          <Phone className="h-3 w-3" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${String(candidate.mobile).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  }
                />
              )}
              {!isContactHidden && (
                <DetailRow
                  label="Email"
                  value={
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100 break-all">{candidate.email}</span>
                      {candidate.email && (
                        <a
                          href={`mailto:${candidate.email}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-[#0F766E] hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/50 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="h-3 w-3" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  }
                />
              )}
              {[{ label: 'State', value: candidate.state }, { label: 'City', value: candidate.city }, { label: 'Area', value: candidate.area }, { label: 'Address', value: candidate.address }]
                .filter((item) => item.value)
                .map((item) => (
                  <DetailRow key={item.label} label={item.label} value={item.value} />
                ))}
            </dl>
          </CardContent>
        </Card>

        {/* Professional Background Container */}
        <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 flex flex-col justify-between">
          <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                <Briefcase className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Professional Details</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Experience parameters, target deployment tags, and tiers</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-5 flex-grow">
            <dl className="divide-y divide-slate-100 dark:divide-slate-800/40">
              <DetailRow label="Position" value={candidate.position} />
              {candidate.source && <DetailRow label="Source Target" value={candidate.source} />}
              <DetailRow
                label="Qualifications"
                value={
                  candidate.qualifications?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.qualifications.map((q) => (
                        <Badge key={q} variant="outline" className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border-purple-200/60 bg-purple-50/80 text-purple-700 shadow-none">
                          {q}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className={canViewProfileDetails ? 'text-slate-400 dark:text-slate-500 font-medium text-xs' : 'inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded-lg'}>
                      {canViewProfileDetails ? 'None Documented' : 'Locked — Unlock Profile'}
                    </span>
                  )
                }
              />
              <DetailRow
                label="Experience"
                value={
                  canViewProfileDetails ? (
                    <span className="text-sm font-semibold">{candidate.experienceYears} Years</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50/80 border border-rose-200/60 px-2 py-0.5 rounded-lg">Locked — Unlock Profile</span>
                  )
                }
              />
              {canViewProfileDetails && candidate.expectedSalary != null && (
                <DetailRow
                  label="Expected Monthly Salary"
                  value={
                    <span className="text-xs font-bold border border-emerald-200/60 bg-emerald-50/80 text-emerald-700 px-2.5 py-1 rounded-lg">
                      ₹{candidate.expectedSalary.toLocaleString()} / Month
                    </span>
                  }
                />
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Role-Specific Custom Parameters Container (Dynamic from Super Admin Configuration) */}
        {canViewProfileDetails && (() => {
          const roleRows = [];
          const pos = candidate.position;
          const posDef = (positionsData || []).find(
            (p) => (typeof p === 'object' ? p.name : p) === pos
          );

          if (posDef && posDef.fields?.length > 0) {
            posDef.fields.forEach((field) => {
              const val = candidate[field.name];
              if (val != null && val !== '') {
                let displayVal = val;
                if (field.type === 'checkbox') {
                  displayVal = val ? 'Yes' : 'No';
                } else if (Array.isArray(val)) {
                  displayVal = val.length ? val.join(', ') : '-';
                } else if (field.name.toLowerCase().includes('experience') && typeof val === 'number') {
                  displayVal = `${val} Years`;
                }
                roleRows.push({ label: field.label, value: String(displayVal) });
              }
            });
          } else {
            // Fallback for positions without DB fields
            if (pos === 'Teacher') {
              if (candidate.subjects?.length) roleRows.push({ label: 'Subjects', value: candidate.subjects.join(', ') });
              if (candidate.classesCanTeach?.length) roleRows.push({ label: 'Classes Can Teach', value: candidate.classesCanTeach.join(', ') });
              if (candidate.medium) roleRows.push({ label: 'Medium', value: candidate.medium });
              if (candidate.boardExperience?.length) roleRows.push({ label: 'Board Experience', value: candidate.boardExperience.join(', ') });
              if (candidate.bEd != null) roleRows.push({ label: 'B.Ed Qualification', value: candidate.bEd ? 'Yes' : 'No' });
              if (candidate.mEd != null) roleRows.push({ label: 'M.Ed Qualification', value: candidate.mEd ? 'Yes' : 'No' });
            } else if (pos === 'Driver') {
              if (candidate.vehicleTypes?.length) roleRows.push({ label: 'Vehicle Types', value: candidate.vehicleTypes.join(', ') });
              if (candidate.drivingExperience != null) roleRows.push({ label: 'Driving Experience', value: `${candidate.drivingExperience} Years` });
              if (candidate.lightVehicle != null) roleRows.push({ label: 'Light Vehicle License', value: candidate.lightVehicle ? 'Yes' : 'No' });
              if (candidate.heavyVehicle != null) roleRows.push({ label: 'Heavy Vehicle License', value: candidate.heavyVehicle ? 'Yes' : 'No' });
              if (candidate.schoolBusExperience != null) roleRows.push({ label: 'School Bus Experience', value: candidate.schoolBusExperience ? 'Yes' : 'No' });
            } else if (pos === 'Accountant') {
              if (candidate.tallyKnowledge != null) roleRows.push({ label: 'Tally Knowledge', value: candidate.tallyKnowledge ? 'Yes' : 'No' });
              if (candidate.gstKnowledge != null) roleRows.push({ label: 'GST Knowledge', value: candidate.gstKnowledge ? 'Yes' : 'No' });
              if (candidate.payrollExperience != null) roleRows.push({ label: 'Payroll Experience', value: candidate.payrollExperience ? 'Yes' : 'No' });
              if (candidate.schoolAccountingExperience != null) roleRows.push({ label: 'School Accounting', value: candidate.schoolAccountingExperience ? 'Yes' : 'No' });
              if (candidate.erpExperience != null) roleRows.push({ label: 'ERP Experience', value: candidate.erpExperience ? 'Yes' : 'No' });
            } else if (pos === 'Receptionist') {
              if (candidate.languagesKnown?.length) roleRows.push({ label: 'Languages Known', value: candidate.languagesKnown.join(', ') });
              if (candidate.computerSkills != null) roleRows.push({ label: 'Computer Skills', value: candidate.computerSkills ? 'Yes' : 'No' });
              if (candidate.frontDeskExperience != null) roleRows.push({ label: 'Front Desk Experience', value: candidate.frontDeskExperience ? 'Yes' : 'No' });
              if (candidate.communicationSkills != null) roleRows.push({ label: 'Communication Skills', value: candidate.communicationSkills ? 'Yes' : 'No' });
            } else if (pos === 'Clerk') {
              if (candidate.typingSpeed) roleRows.push({ label: 'Typing Speed', value: candidate.typingSpeed });
              if (candidate.msOfficeKnowledge != null) roleRows.push({ label: 'MS Office Knowledge', value: candidate.msOfficeKnowledge ? 'Yes' : 'No' });
              if (candidate.excelKnowledge != null) roleRows.push({ label: 'Excel Knowledge', value: candidate.excelKnowledge ? 'Yes' : 'No' });
              if (candidate.schoolOfficeExperience != null) roleRows.push({ label: 'School Office Experience', value: candidate.schoolOfficeExperience ? 'Yes' : 'No' });
            } else if (pos === 'Librarian') {
              if (candidate.libraryManagementExperience != null) roleRows.push({ label: 'Library Management', value: candidate.libraryManagementExperience ? 'Yes' : 'No' });
              if (candidate.librarySoftwareKnowledge != null) roleRows.push({ label: 'Library Software', value: candidate.librarySoftwareKnowledge ? 'Yes' : 'No' });
            } else if (pos === 'Lab Assistant') {
              if (candidate.labType) roleRows.push({ label: 'Lab Type', value: candidate.labType });
              if (candidate.labExperience != null) roleRows.push({ label: 'Lab Experience', value: candidate.labExperience ? 'Yes' : 'No' });
            } else if (pos === 'Sports Coach') {
              if (candidate.sportsSpecialization) roleRows.push({ label: 'Sports Specialization', value: candidate.sportsSpecialization });
              if (candidate.coachingCertificates?.length) roleRows.push({ label: 'Coaching Certificates', value: candidate.coachingCertificates.join(', ') });
              if (candidate.coachingExperience != null) roleRows.push({ label: 'Coaching Experience', value: `${candidate.coachingExperience} Years` });
            } else if (pos === 'Security Guard') {
              if (candidate.exArmy != null) roleRows.push({ label: 'Ex-Army Background', value: candidate.exArmy ? 'Yes' : 'No' });
              if (candidate.securityExperience != null) roleRows.push({ label: 'Security Experience', value: candidate.securityExperience ? 'Yes' : 'No' });
              if (candidate.nightShiftAvailable != null) roleRows.push({ label: 'Night Shift Available', value: candidate.nightShiftAvailable ? 'Yes' : 'No' });
            } else if (pos === 'Cleaner') {
              if (candidate.cleaningExperience != null) roleRows.push({ label: 'Cleaning Experience', value: candidate.cleaningExperience ? 'Yes' : 'No' });
              if (candidate.schoolExperience != null) roleRows.push({ label: 'School Experience', value: candidate.schoolExperience ? 'Yes' : 'No' });
            }
          }

          if (roleRows.length === 0) return null;

          return (
            <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 lg:col-span-2 overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0F766E]" />
                  {candidate.position} Specific Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-800">
                  {roleRows.map((r, i) => (
                    <DetailRow key={i} label={r.label} value={r.value} />
                  ))}
                </dl>
              </CardContent>
            </Card>
          );
        })()}

        {/* Notes Segment Block Container */}
        {canViewProfileDetails && !isContactHidden && candidate.notes && (
          <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 lg:col-span-2 overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
              <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Additional Candidate Annotations</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">{candidate.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Credentials & Documents Portfolio Section Grid */}
        {canViewProfileDetails && (
          <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 lg:col-span-2 overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <FileCheck className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Verification Documentation</CardTitle>
                  <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Indexed portfolio files ({candidate.documents?.length || 0})</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-5">
              {candidate.documents?.length === 0 ? (
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 text-center py-6">No background verification files or resumes uploaded onto this candidate card node.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidate.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/doc flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-all bg-white dark:bg-slate-950 hover:border-purple-200/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0 transition-transform group-hover/doc:scale-105">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover/doc:text-purple-600 transition-colors">{doc.name}</p>
                        {doc.note && (
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 italic">
                            "{doc.note}"
                          </p>
                        )}
                        <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                          <span>View Link</span> 
                          <ExternalLink className="h-2.5 w-2.5 transition-transform group-hover/doc:translate-x-0.5" />
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Legal / Outreach Request Messaging Pipeline Form Segment */}
        {candidate.canSendInterest && (
          <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900 lg:col-span-2 overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <Send className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Outreach Intent Request Pipeline</CardTitle>
                  <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Notify and ping applicant about vacant career configurations within your enterprise workspace</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-5">
              {hasSentInterest ? (
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/80 p-4 flex gap-3 text-xs font-semibold text-emerald-600 leading-relaxed shadow-none animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 mb-0.5">Intent Packet Dispatched</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      An interest notification request package was dispatched onto <span className="font-bold">{formatDate(interestStatus.createdAt)}</span> regarding the allocation of the <span className="bg-emerald-100 dark:bg-slate-950 text-emerald-600 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{interestStatus.positionOffered}</span> vacancy tier. The talent asset will be prompted for communication releases.
                    </p>
                  </div>
                </div>
              ) : showInterestForm ? (
                <form onSubmit={handleInterestSubmit} className="space-y-5 max-w-xl animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Issuing Institution Title</Label>
                      <Input value={school?.schoolName || ''} disabled className="h-11 border-slate-200 rounded-lg dark:bg-slate-950 dark:border-slate-800 cursor-not-allowed opacity-60 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Position Offered *</Label>
                      <Input
                        value={interestForm.positionOffered}
                        onChange={(e) => setInterestForm({ ...interestForm, positionOffered: e.target.value })}
                        placeholder="e.g. Mathematics Teacher"
                        className="h-11 border-slate-200 rounded-lg focus-visible:ring-purple-600 focus-visible:border-purple-200/60 dark:bg-slate-800 dark:border-slate-700 text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Custom Onboarding Context Message *</Label>
                    <Textarea
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Introduce your school branding values, operational packages, and specific timeline milestones..."
                      className="border-slate-200 rounded-lg focus-visible:ring-purple-600 focus-visible:border-purple-200/60 dark:bg-slate-800 dark:border-slate-700 text-sm pl-4 pt-3 transition-all min-h-[110px]"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      type="submit" 
                      disabled={interestMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg h-11 px-5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{interestMutation.isPending ? 'Dispatching...' : 'Dispatch Intent Request'}</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowInterestForm(false)}
                      className="rounded-lg h-11 px-4 font-medium border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 max-w-2xl animate-in fade-in duration-200">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                    Trigger an outbound evaluation sequence to immediately alert this talent asset. Once the candidate signs off or responds, their private data lines open up onto your workspace console pipeline automatically.
                  </p>
                  <Button 
                    onClick={() => setShowInterestForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider px-5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Initialize Outreach Interaction</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* A4 PRINTABLE CANDIDATE BIODATA SHEET (Print-only for physical interview panel) */}
      {/* ------------------------------------------------------------- */}
      <div className="print-only font-sans text-black p-4 text-[12px] leading-relaxed max-w-[210mm] mx-auto bg-white">
        {/* School Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {school?.logoUrl && (
              <img src={school.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
            )}
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900">
                {school?.schoolName || 'Recruitment Cell'}
              </h1>
              <p className="text-[11px] text-slate-600">
                {school?.address ? `${school.address}, ` : ''}{school?.city || ''}{school?.state ? `, ${school.state}` : ''}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {school?.schoolId ? `School Code: #${school.schoolId}` : ''}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block border border-slate-900 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider">
              Interview Biodata Sheet
            </span>
            <p className="text-[10px] text-slate-600 mt-0.5">Date: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Candidate Top Box */}
        <div className="flex gap-4 border border-slate-300 rounded p-2.5 mb-3 bg-slate-50/30">
          <div className="w-24 h-28 border border-slate-300 bg-white flex items-center justify-center shrink-0 overflow-hidden rounded">
            {candidate.profilePhoto ? (
              <img src={candidate.profilePhoto} alt={candidate.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="text-center p-1 text-slate-400">
                <User className="h-6 w-6 mx-auto mb-0.5 text-slate-300" />
                <span className="text-[9px] uppercase font-bold">Affix Photo</span>
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Candidate Name</span>
              <strong className="text-xs font-black text-slate-900">{candidate.fullName}</strong>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Applied Role</span>
              <strong className="text-xs font-black text-slate-900">{candidate.position}</strong>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Contact Mobile</span>
              <span className="font-bold">{candidate.mobile || '—'}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">WhatsApp Number</span>
              <span>{candidate.whatsappNumber || candidate.mobile || '—'}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Email Address</span>
              <span>{candidate.email || '—'}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Gender & Age</span>
              <span>{candidate.gender || '—'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Residential Address</span>
              <span>{[candidate.address, candidate.area, candidate.city, candidate.state].filter(Boolean).join(', ') || '—'}</span>
            </div>
          </div>
        </div>

        {/* Professional Qualifications & Experience Table */}
        <div className="mb-3">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Academic & Professional Qualifications
          </h3>
          <table className="w-full text-[11px] border border-slate-300">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/3 p-1.5 bg-slate-100 font-bold border-r border-slate-200">Highest Qualifications</td>
                <td className="p-1.5">{candidate.qualifications?.join(', ') || '—'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">B.Ed / Teacher Training</td>
                <td className="p-1.5">{candidate.bEd ? 'Yes (B.Ed Qualified)' : 'No'} {candidate.mEd ? ', M.Ed Qualified' : ''}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">Teaching Subjects</td>
                <td className="p-1.5">{candidate.subjects?.join(', ') || '—'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">Classes Can Teach</td>
                <td className="p-1.5">{candidate.classesCanTeach?.join(', ') || '—'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">Medium of Instruction</td>
                <td className="p-1.5">{candidate.medium || 'English / Hindi'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">Total Experience</td>
                <td className="p-1.5 font-bold">{candidate.experienceYears ? `${candidate.experienceYears} Years` : 'Fresher (0 Years)'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">Board Experience</td>
                <td className="p-1.5">{candidate.boardExperience?.join(', ') || '—'}</td>
              </tr>
              <tr>
                <td className="p-1.5 bg-slate-100 font-bold border-r border-slate-200">Expected Salary</td>
                <td className="p-1.5">{candidate.expectedSalary ? `₹${candidate.expectedSalary.toLocaleString()} / Month` : 'Negotiable as per school norms'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Physical Interview Committee Assessment Rubric */}
        <div className="border border-slate-900 rounded p-2.5 mt-3">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5">
            Interview Panel Assessment & Evaluation Rubric (Official Panel Use Only)
          </h3>
          <table className="w-full text-[11px] border border-slate-300 mb-2">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-1 text-left border-r border-slate-300">Assessment Parameter</th>
                <th className="p-1 text-center w-20 border-r border-slate-300">Max Marks</th>
                <th className="p-1 text-center w-24 border-r border-slate-300">Score</th>
                <th className="p-1 text-left">Remarks / Panel Observations</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-1 border-r border-slate-300">1. Subject Mastery & Content Clarity</td>
                <td className="p-1 text-center border-r border-slate-300">10</td>
                <td className="p-1 text-center border-r border-slate-300 font-bold">/ 10</td>
                <td className="p-1"></td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1 border-r border-slate-300">2. English Fluency & Communication</td>
                <td className="p-1 text-center border-r border-slate-300">10</td>
                <td className="p-1 text-center border-r border-slate-300 font-bold">/ 10</td>
                <td className="p-1"></td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1 border-r border-slate-300">3. Blackboard Writing & Teaching Aids</td>
                <td className="p-1 text-center border-r border-slate-300">10</td>
                <td className="p-1 text-center border-r border-slate-300 font-bold">/ 10</td>
                <td className="p-1"></td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1 border-r border-slate-300">4. Classroom Presence & Student Control</td>
                <td className="p-1 text-center border-r border-slate-300">10</td>
                <td className="p-1 text-center border-r border-slate-300 font-bold">/ 10</td>
                <td className="p-1"></td>
              </tr>
              <tr>
                <td className="p-1 border-r border-slate-300 font-bold">Total Score</td>
                <td className="p-1 text-center border-r border-slate-300 font-bold">40</td>
                <td className="p-1 text-center border-r border-slate-300 font-bold">/ 40</td>
                <td className="p-1"></td>
              </tr>
            </tbody>
          </table>

          {/* Final Decision Box */}
          <div className="grid grid-cols-2 gap-4 text-[11px] pt-1.5">
            <div>
              <p className="font-bold text-slate-800 mb-0.5">Committee Recommendation:</p>
              <div className="flex gap-3 items-center">
                <span>[ &nbsp; ] Selected</span>
                <span>[ &nbsp; ] Demo 2</span>
                <span>[ &nbsp; ] Rejected</span>
              </div>
              <p className="mt-2 font-medium">Offered Salary: ₹ _________________ / month</p>
            </div>
            <div className="text-right flex flex-col justify-between">
              <div>
                <p className="font-bold text-slate-800">Interviewer Signature(s):</p>
                <div className="mt-6 border-t border-slate-400 w-44 ml-auto text-center text-[9px] text-slate-500">
                  Principal / Head of Department
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}