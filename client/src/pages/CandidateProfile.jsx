import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Pencil, FileText, ExternalLink, Lock, Send, Unlock, User, Briefcase, 
  FileCheck, ShieldAlert, BadgeInfo, CheckCircle2, Loader2, Sparkles, 
  Phone, MessageSquare, Mail, Printer, Star, Calendar, BookmarkCheck, Check,
  MapPin, AlertCircle, X, ArrowLeft, AlertTriangle, RotateCcw, Save
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
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { CandidateDocumentsModal } from '@/components/common/CandidateDocumentsModal';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshSchool, school } = useAuth();
  const [interestForm, setInterestForm] = useState({ positionOffered: '', message: '' });
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState('new');
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [candidateRating, setCandidateRating] = useState(0);
  const [interviewDate, setInterviewDate] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
  });

  const initialStatus = candidate?.status || 'new';
  const initialNotes = candidate?.notes || '';
  const initialRating = candidate?.rating || 0;
  const initialInterviewDate = candidate?.interviewDate
    ? new Date(candidate.interviewDate).toISOString().slice(0, 16)
    : '';

  useEffect(() => {
    if (candidate) {
      setPipelineStatus(initialStatus);
      setInterviewerNotes(initialNotes);
      setCandidateRating(initialRating);
      setInterviewDate(initialInterviewDate);
    }
  }, [candidate]);

  const isDirty = Boolean(
    candidate && (
      pipelineStatus !== initialStatus ||
      interviewerNotes !== initialNotes ||
      candidateRating !== initialRating ||
      interviewDate !== initialInterviewDate
    )
  );

  const handleReset = () => {
    setPipelineStatus(initialStatus);
    setInterviewerNotes(initialNotes);
    setCandidateRating(initialRating);
    setInterviewDate(initialInterviewDate);
  };

  // Browser tab close / refresh protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Intercept navigation link clicks across the page if there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;

    const handleDocumentClick = (e) => {
      // Find closest link or action that navigates
      const target = e.target.closest('a');
      if (!target) return;

      // Ignore links inside modal, external triggers (tel, mailto, whatsapp) or same page anchors
      if (target.closest('.unsaved-modal') || target.closest('.no-intercept')) return;

      const href = target.getAttribute('href');
      if (
        href && 
        !href.startsWith('tel:') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('https://wa.me') &&
        !href.startsWith('#')
      ) {
        e.preventDefault();
        e.stopPropagation();
        setPendingNavigation(() => () => navigate(href));
        setShowUnsavedModal(true);
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [isDirty, navigate]);

  // Browser back button (popstate) protection
  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      if (isDirty) {
        window.history.pushState(null, '', window.location.href);
        setPendingNavigation(() => () => window.history.back());
        setShowUnsavedModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty]);

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

  const handleSaveAll = async (onComplete) => {
    try {
      await updatePipelineMutation.mutateAsync({
        status: pipelineStatus,
        notes: interviewerNotes,
        rating: candidateRating,
        interviewDate: interviewDate || undefined,
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Failed to save candidate evaluation', err);
    }
  };

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
      setStatusBanner({ type: 'error', message: err.response?.data?.message || 'Failed to unlock profile. Please try again.' });
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
    <div className="space-y-4 w-full antialiased text-slate-800 dark:text-white">
      
      {/* Top Navigation Row: Back to Candidates link */}
      <div className="flex items-center justify-between no-print pt-1">
        <button
          type="button"
          onClick={() => {
            if (isDirty) {
              setPendingNavigation(() => () => navigate('/candidates'));
              setShowUnsavedModal(true);
            } else {
              navigate('/candidates');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F766E] dark:hover:text-teal-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Biodata List</span>
        </button>

        {isDirty && (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Unsaved changes in evaluation
          </span>
        )}
      </div>

      {statusBanner && (
        <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all no-print shadow-2xs ${
          statusBanner.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusBanner.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
            <span>{statusBanner.message}</span>
          </div>
          <button onClick={() => setStatusBanner(null)} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. COMPACT HERO HEADER: IDENTITY + QUICK ACTIONS + PRINT/EDIT */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Avatar + Candidate Core Info + Quick Communication */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              {candidate.profilePhoto ? (
                <img
                  src={candidate.profilePhoto}
                  alt={candidate.fullName}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-teal-600/20 shadow-xs"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-[#0F766E] to-teal-500 text-white flex items-center justify-center text-2xl font-black shadow-xs">
                  {candidate.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-bold" title="Candidate Profile Active">
                ✓
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {candidate.fullName}
                </h1>
                <Badge className="bg-teal-50 text-[#0F766E] border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {candidate.position}
                </Badge>
                {candidate.gender && (
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                    {candidate.gender}
                  </span>
                )}
                {candidate.experienceYears != null && (
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
                    {candidate.experienceYears > 0 ? `${candidate.experienceYears} Yrs Exp` : 'Fresher'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">Added {formatDate(candidate.createdAt)}</span>
                {candidate.source && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Source: {candidate.source}</span>
                  </>
                )}
                {(candidate.city || candidate.state) && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      {[candidate.area, candidate.city, candidate.state].filter(Boolean).join(', ')}
                    </span>
                  </>
                )}
              </div>

              {/* Direct Quick 1-Click Action Buttons: Call, WhatsApp, Email */}
              {!isContactHidden && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {candidate.mobile && (
                    <a
                      href={`tel:${candidate.mobile}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 transition-all active:scale-95 shadow-2xs"
                      title="Call candidate directly"
                    >
                      <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>Call: {candidate.mobile}</span>
                    </a>
                  )}
                  {candidate.mobile && (
                    <a
                      href={`https://wa.me/91${String(candidate.whatsappNumber || candidate.mobile).replace(/\D/g, '').slice(-10)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-all active:scale-95 shadow-2xs"
                      title="Open WhatsApp chat"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366] shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {candidate.email && (
                    <a
                      href={`mailto:${candidate.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 transition-all active:scale-95 shadow-2xs"
                      title="Send email"
                    >
                      <Mail className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                      <span className="max-w-[150px] truncate">{candidate.email}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Print Biodata & Edit Actions */}
          <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end shrink-0">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                type="button"
                onClick={() => setShowDocumentsModal(true)}
                className="h-9 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/70 font-bold text-xs gap-1.5 shadow-xs transition-all active:scale-95"
                title="View Attached Documents & Resumes"
              >
                <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>View Documents</span>
                {candidate.documents?.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                    {candidate.documents.length}
                  </span>
                )}
              </Button>

              <Button 
                onClick={() => window.print()}
                className="h-9 px-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs gap-1.5 shadow-xs transition-all active:scale-95"
                title="Print A4 Interview Biodata Sheet"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Sheet (A4)</span>
              </Button>

              {candidate.canEdit && (
                <Button 
                  asChild
                  variant="outline"
                  className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 transition-all shadow-xs"
                >
                  <Link to={`/candidates/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </Link>
                </Button>
              )}

              {isLocked && (
                <Button 
                  onClick={() => unlockMutation.mutate()} 
                  disabled={unlockMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-9 px-4 text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
                >
                  {unlockMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                    <>
                      <Unlock className="h-3.5 w-3.5" />
                      <span>Unlock Profile</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. COMPACT PIPELINE & EVALUATION TOOLBAR (MANUAL SAVE) */}
      {/* ------------------------------------------------------------- */}
      {candidate.canEdit && (
        <div className={`evaluation-section bg-white dark:bg-slate-900 border rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3 no-print transition-all ${
          isDirty 
            ? 'border-teal-400 dark:border-teal-600 ring-2 ring-teal-100 dark:ring-teal-950/50' 
            : 'border-slate-200/80 dark:border-slate-800'
        }`}>
          
          {/* Row 1: Pipeline Stage Pills + Star Rating + Documents Button + Save/Reset */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">Stage:</span>
              {PIPELINE_STAGES.map((stage) => {
                const isActive = pipelineStatus === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setPipelineStatus(stage.id)}
                    className={`h-7 px-2.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${stage.color} ${
                      isActive 
                        ? 'ring-2 ring-[#0F766E] shadow-2xs font-extrabold scale-102' 
                        : 'opacity-65 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                    <span>{stage.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Star Rating + View Documents Button + Save / Reset action bar */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCandidateRating(star)}
                    className="p-0.5 hover:scale-125 transition-transform text-amber-400"
                    title={`${star} Star Rating`}
                  >
                    <Star 
                      className={`h-3.5 w-3.5 ${star <= candidateRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                    />
                  </button>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => setShowDocumentsModal(true)}
                className="h-7 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/70 font-bold text-xs rounded-lg gap-1.5 transition-all shadow-2xs"
                title="View Candidate Documents"
              >
                <FileText className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                <span>Documents</span>
                {candidate.documents?.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                    {candidate.documents.length}
                  </span>
                )}
              </Button>

              {isDirty && (
                <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg gap-1"
                    title="Revert to saved state"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </Button>

                  <Button
                    onClick={() => handleSaveAll()}
                    disabled={updatePipelineMutation.isPending}
                    className="h-7 px-3 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs rounded-lg shadow-sm gap-1 active:scale-95 transition-all"
                  >
                    {updatePipelineMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern Informational Banners (Locked / Contact Hidden) */}
      {isLocked && (
        <div className="rounded-xl border border-rose-200/60 bg-rose-50/80 p-3.5 flex gap-3 text-xs font-semibold text-rose-600 leading-relaxed no-print">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-rose-700 mb-0.5">Preview Mode Restrained</p>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Unlock this candidate to reveal qualifications, experience, expected remuneration, and verification documents.</p>
          </div>
        </div>
      )}

      {canViewProfileDetails && isContactHidden && (
        <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/80 p-3.5 flex gap-3 text-xs font-semibold text-cyan-700 leading-relaxed no-print">
          <BadgeInfo className="h-4 w-4 shrink-0 text-cyan-600 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-700 mb-0.5">Profile Gateway Unlocked</p>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Professional criteria are visible. Candidate mobile and email will be revealed once candidate acknowledges your interest request.</p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. HIGH-DENSITY 2-COLUMN CREDENTIALS GRID */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 no-print">
        
        {/* LEFT COLUMN: Personal & Contact Information */}
        <Card className="border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-lg">
                <User className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Personal & Contact Details</CardTitle>
                <CardDescription className="text-[11px] text-slate-400">Communication lines & residence records</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3.5 sm:p-4 flex-grow space-y-1">
            <dl className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <div className="flex items-center justify-between py-2 text-xs">
                <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Full Name</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100">{candidate.fullName}</dd>
              </div>

              {candidate.gender && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Gender</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{candidate.gender}</dd>
                </div>
              )}

              {!isContactHidden && candidate.mobile && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Mobile</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{candidate.mobile}</span>
                    <a
                      href={`tel:${candidate.mobile}`}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60"
                    >
                      Call
                    </a>
                  </dd>
                </div>
              )}

              {!isContactHidden && (candidate.whatsappNumber || candidate.mobile) && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">WhatsApp</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.whatsappNumber || candidate.mobile}</span>
                    <a
                      href={`https://wa.me/${String(candidate.whatsappNumber || candidate.mobile).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                    >
                      Chat
                    </a>
                  </dd>
                </div>
              )}

              {!isContactHidden && candidate.email && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Email</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                    <a href={`mailto:${candidate.email}`} className="hover:underline text-teal-600 dark:text-teal-400">
                      {candidate.email}
                    </a>
                  </dd>
                </div>
              )}

              {candidate.address && (
                <div className="flex items-start justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px] shrink-0 pt-0.5">Address</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[70%]">{candidate.address}</dd>
                </div>
              )}

              {(candidate.area || candidate.city || candidate.state) && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">City & Region</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">
                    {[candidate.area, candidate.city, candidate.state].filter(Boolean).join(', ')}
                  </dd>
                </div>
              )}

              {candidate.source && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Submission Channel</dt>
                  <dd className="font-semibold text-slate-700 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                      {candidate.source}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Professional Details & Core Metrics */}
        <Card className="border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 rounded-lg">
                <Briefcase className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Professional Credentials</CardTitle>
                <CardDescription className="text-[11px] text-slate-400">Experience, qualifications & salary parameters</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3.5 sm:p-4 flex-grow space-y-3">
            {/* Top Stat Highlights Bar */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">Experience</span>
                <span className="text-base font-black text-indigo-900 dark:text-indigo-100">
                  {canViewProfileDetails ? (candidate.experienceYears > 0 ? `${candidate.experienceYears} Years` : 'Fresher') : 'Locked'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">Expected Salary</span>
                <span className="text-base font-black text-emerald-900 dark:text-emerald-100">
                  {canViewProfileDetails && candidate.expectedSalary ? `₹${candidate.expectedSalary.toLocaleString()} / mo` : 'Negotiable'}
                </span>
              </div>
            </div>

            <dl className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <div className="flex items-center justify-between py-2 text-xs">
                <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Designation / Role</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100">{candidate.position}</dd>
              </div>

              <div className="flex items-start justify-between py-2 text-xs">
                <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px] shrink-0 pt-0.5">Qualifications</dt>
                <dd className="text-right max-w-[70%]">
                  {candidate.qualifications?.length > 0 ? (
                    <div className="flex flex-wrap justify-end gap-1">
                      {candidate.qualifications.map((q) => (
                        <span key={q} className="text-[11px] font-bold px-2 py-0.5 rounded-md border border-purple-200/80 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
                          {q}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 font-medium">None Documented</span>
                  )}
                </dd>
              </div>

              {/* Role-Specific Highlights in the Right Column */}
              {candidate.subjects?.length > 0 && (
                <div className="flex items-start justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px] shrink-0 pt-0.5">Teaching Subjects</dt>
                  <dd className="flex flex-wrap justify-end gap-1 max-w-[70%]">
                    {candidate.subjects.map((sub) => (
                      <span key={sub} className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-[#0F766E] border border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800">
                        {sub}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {candidate.classesCanTeach?.length > 0 && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Classes</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{candidate.classesCanTeach.join(', ')}</dd>
                </div>
              )}

              {candidate.medium && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Medium</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{candidate.medium}</dd>
                </div>
              )}

              {candidate.boardExperience?.length > 0 && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Boards</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{candidate.boardExperience.join(', ')}</dd>
                </div>
              )}

              {candidate.bEd != null && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">B.Ed Trained</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{candidate.bEd ? 'Yes' : 'No'}</dd>
                </div>
              )}

              {/* Driver specifics */}
              {candidate.vehicleTypes?.length > 0 && (
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Vehicles</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">{candidate.vehicleTypes.join(', ')}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Dynamic / Role-Specific Details (if extra fields present) */}
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
            // Other positions extra fields
            if (pos === 'Driver') {
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
            <Card className="border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 rounded-2xl overflow-hidden lg:col-span-2">
              <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0F766E]" />
                  <span>{candidate.position} Specific Qualifications & Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {roleRows.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{r.label}</dt>
                      <dd className="text-xs font-bold text-slate-800 dark:text-slate-100">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          );
        })()}

        {/* Documents & Portfolio Card */}
        {canViewProfileDetails && (
          <Card className="border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 rounded-2xl overflow-hidden lg:col-span-2">
            <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-lg">
                  <FileCheck className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Attached Documents & Resumes</CardTitle>
                  <CardDescription className="text-[11px] text-slate-400">Indexed portfolio files ({candidate.documents?.length || 0})</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3.5 sm:p-4">
              {candidate.documents?.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  No resumes or certificates uploaded for this candidate yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {candidate.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-teal-50 text-[#0F766E] shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0F766E] transition-colors">{doc.name}</p>
                          {doc.note && <p className="text-[10px] text-slate-400 truncate">{doc.note}</p>}
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0F766E] shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Outreach Intent Request (Shared talent pool outreach) */}
        {candidate.canSendInterest && (
          <Card className="border border-slate-200/80 bg-white shadow-xs dark:bg-slate-900 rounded-2xl overflow-hidden lg:col-span-2">
            <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                  <Send className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Outreach Intent Request Pipeline</CardTitle>
                  <CardDescription className="text-[11px] text-slate-400">Ping candidate regarding job vacancies at your school</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3.5 sm:p-4">
              {hasSentInterest ? (
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Interest packet sent on <strong className="font-bold">{formatDate(interestStatus.createdAt)}</strong> for position <strong className="font-bold">{interestStatus.positionOffered}</strong>.
                  </span>
                </div>
              ) : showInterestForm ? (
                <form onSubmit={handleInterestSubmit} className="space-y-3 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">School Name</Label>
                      <Input value={school?.schoolName || ''} disabled className="h-9 border-slate-200 rounded-lg opacity-60 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Position Offered *</Label>
                      <Input
                        value={interestForm.positionOffered}
                        onChange={(e) => setInterestForm({ ...interestForm, positionOffered: e.target.value })}
                        placeholder="e.g. Mathematics Teacher"
                        className="h-9 border-slate-200 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Message to Candidate *</Label>
                    <Textarea
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Brief message introducing the role, salary offer range, etc."
                      className="border-slate-200 rounded-lg text-xs min-h-[80px]"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-1">
                    <Button 
                      type="submit" 
                      disabled={interestMutation.isPending}
                      className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold rounded-lg h-9 px-4 text-xs flex items-center gap-1.5"
                    >
                      <Send className="h-3 w-3" />
                      <span>{interestMutation.isPending ? 'Sending...' : 'Send Request'}</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowInterestForm(false)}
                      className="rounded-lg h-9 px-3 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-500 max-w-xl">
                    Send an official school outreach ping to this candidate. Once accepted, their full contact lines will be released.
                  </p>
                  <Button 
                    onClick={() => setShowInterestForm(true)}
                    className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold h-9 rounded-xl text-xs px-4 shrink-0 flex items-center gap-1.5"
                  >
                    <Send className="h-3 w-3" />
                    <span>Send Outreach Request</span>
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
      {/* ------------------------------------------------------------- */}
      {/* UNSAVED CHANGES CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {showUnsavedModal && (
        <div className="unsaved-modal fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 no-print">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 shrink-0">
                <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Unsaved Changes in Evaluation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Aapne recruitment stage, rating ya notes me changes kiye hain jo abhi save nahi hue hain. Kya aap pehle in changes ko save karna chahte hain?
                </p>
              </div>
            </div>

            {/* Quick Summary of Modified Items */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Stage:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{pipelineStatus.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Rating:</span>
                <span className="font-bold text-amber-500">{candidateRating} / 5 Stars</span>
              </div>
              {interviewDate && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Interview:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{interviewDate.replace('T', ' ')}</span>
                </div>
              )}
              {interviewerNotes && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Notes:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{interviewerNotes}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <Button
                onClick={() => {
                  handleSaveAll(() => {
                    setShowUnsavedModal(false);
                    if (pendingNavigation) pendingNavigation();
                  });
                }}
                disabled={updatePipelineMutation.isPending}
                className="w-full sm:w-auto flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs h-9 rounded-xl gap-1.5 shadow-sm"
              >
                {updatePipelineMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save & Exit</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  setShowUnsavedModal(false);
                  if (pendingNavigation) pendingNavigation();
                }}
                className="w-full sm:w-auto text-xs font-bold h-9 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400"
              >
                Discard & Leave
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowUnsavedModal(false)}
                className="w-full sm:w-auto text-xs font-medium h-9 rounded-xl text-slate-500 hover:text-slate-800"
              >
                Keep Editing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Attached Documents Modal */}
      <CandidateDocumentsModal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        candidate={candidate}
      />
    </div>
  );
}