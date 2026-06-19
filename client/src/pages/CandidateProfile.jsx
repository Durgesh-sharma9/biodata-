import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Pencil, FileText, ExternalLink, Lock, Send, Unlock, User, Briefcase, FileCheck, ShieldAlert, BadgeInfo, CheckCircle2, Loader2 } from 'lucide-react';
import {
  getCandidate,
  unlockCandidate,
  sendInterestRequest,
  getInterestRequestStatus,
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

export default function CandidateProfile() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { refreshSchool, school } = useAuth();
  const [interestForm, setInterestForm] = useState({ positionOffered: '', message: '' });
  const [showInterestForm, setShowInterestForm] = useState(false);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then((r) => r.data.data),
  });

  const { data: interestStatus } = useQuery({
    queryKey: ['interest-status', id],
    queryFn: () => getInterestRequestStatus(id).then((r) => r.data.data),
    enabled: !!candidate?.canSendInterest,
  });

  const unlockMutation = useMutation({
    mutationFn: () => unlockCandidate(id),
    onSuccess: async (res) => {
      queryClient.setQueryData(['candidate', id], res.data.data);
      await refreshSchool();
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to unlock profile');
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
      alert('Interest request sent successfully');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to send interest request');
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
    <div className="space-y-6 p-6 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen animate-in fade-in duration-500">
      
      {/* Page Header Panel Minimalist Scaffolding */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <PageHeader
          title={candidate.fullName}
          description={`${candidate.position}${candidate.source ? ` • ${candidate.source}` : ''} • Added ${formatDate(candidate.createdAt)}`}
        />
        
        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10 self-start md:self-auto">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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
              {candidate.dob && <DetailRow label="Date of Birth" value={new Date(candidate.dob).toLocaleDateString()} />}
              {!isContactHidden && <DetailRow label="Mobile" value={candidate.mobile} />}
              {!isContactHidden && <DetailRow label="Email" value={candidate.email} />}
              {!isContactHidden && <DetailRow label="Address" value={candidate.address} />}
              <DetailRow label="State" value={candidate.state} />
              <DetailRow label="City" value={candidate.city} />
              <DetailRow label="Locality" value={candidate.locality} />
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
                        <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
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
    </div>
  );
}