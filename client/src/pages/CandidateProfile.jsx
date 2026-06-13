import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Pencil, FileText, ExternalLink, Lock, Send, Unlock, User, Briefcase, FileCheck, ShieldAlert, BadgeInfo, CheckCircle2 } from 'lucide-react';
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
      <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 self-center">{label}</dt>
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
      <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto p-4 animate-in fade-in duration-300">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-muted-foreground/50 mb-4 shadow-3xs">
          <User className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-black text-foreground tracking-tight">Candidate Profile Missing</h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
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
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto antialiased text-foreground bg-background">
      
      {/* 1. Header Container Frame with Responsive Actions */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 p-6 dark:from-slate-950 dark:via-background dark:to-slate-950/50 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-44 h-44 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <PageHeader
          title={candidate.fullName}
          description={`${candidate.position}${candidate.source ? ` • ${candidate.source}` : ''} • Added ${formatDate(candidate.createdAt)}`}
        />
        
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10 self-start md:self-auto">
          {isLocked && (
            <Button 
              onClick={() => unlockMutation.mutate()} 
              disabled={unlockMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl h-10 px-4.5 shadow-sm hover:shadow transition-all duration-200 gap-2 shrink-0 text-xs uppercase tracking-wider"
            >
              <Unlock className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Unlock Profile (1 Credit)</span>
            </Button>
          )}
          {candidate.canEdit && (
            <Button 
              asChild
              variant="outline"
              className="h-10 rounded-xl border-slate-200 shadow-2xs font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-50 gap-2 transition-all"
            >
              <Link to={`/candidates/${id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Candidate</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Global Status Info Messaging Banners */}
      {isLocked && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-4 flex gap-3 text-xs font-semibold text-amber-700 dark:text-amber-400 leading-relaxed shadow-3xs animate-in slide-in-from-top-2 duration-300">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-300 text-[10px] mb-0.5">Preview Mode Restrained</p>
            <p className="font-medium text-muted-foreground">Unlock this candidate node to reveal specialized academic qualifications, career history experience years, expected remuneration metrics, geographic placement coordinates, and portfolio documentation. Contact attributes remain safely masked for shared talent pool assets.</p>
          </div>
        </div>
      )}

      {canViewProfileDetails && isContactHidden && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.03] p-4 flex gap-3 text-xs font-semibold text-blue-700 dark:text-blue-400 leading-relaxed shadow-3xs animate-in slide-in-from-top-2 duration-300">
          <BadgeInfo className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
          <div>
            <p className="font-extrabold uppercase tracking-wide text-blue-800 dark:text-blue-300 text-[10px] mb-0.5">Profile Gateway Unlocked</p>
            <p className="font-medium text-muted-foreground">Professional criteria metrics and verification files are now fully exposed. Core personal communication contact indices (mobile / email) remain securely protected until the applicant chooses to acknowledge or approve your outgoing platform Interest Request.</p>
          </div>
        </div>
      )}

      {/* 3. Primary Data Columns Split View Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        
        {/* Basic Details Structural Card */}
        <Card className="rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-5 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <User className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Basic Details</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground/80">Identity parameters and geographic residence logs</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 flex-grow space-y-6">
            {/* Centered Avatar Frame with Micro Accent Outline */}
            <div className="flex justify-center pb-2">
              {candidate.profilePhoto ? (
                <div className="relative p-1 rounded-full border border-slate-200/80 bg-background shadow-3xs">
                  <img
                    src={candidate.profilePhoto}
                    alt={candidate.fullName}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200/60 dark:from-slate-900 dark:to-slate-800 border-2 border-dashed border-slate-300/60 flex items-center justify-center text-slate-700 dark:text-slate-300 text-3xl font-black shadow-inner">
                  {candidate.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            <dl className="divide-y divide-slate-50 dark:divide-slate-900/50">
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

        {/* Professional Background Structural Card */}
        <Card className="rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-5 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <Briefcase className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Professional Details</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground/80">Experience parameters, target deployment tags, and tiers</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 flex-grow">
            <dl className="divide-y divide-slate-50 dark:divide-slate-900/50">
              <DetailRow label="Position" value={candidate.position} />
              {candidate.source && <DetailRow label="Source Target" value={candidate.source} />}
              <DetailRow
                label="Qualifications"
                value={
                  candidate.qualifications?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.qualifications.map((q) => (
                        <Badge key={q} variant="outline" className="text-[11px] font-bold px-2 py-0.5 rounded-md border-indigo-100 bg-indigo-50/30 text-indigo-600 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-indigo-400 shadow-3xs">
                          {q}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className={canViewProfileDetails ? 'text-slate-400 font-medium text-xs' : 'inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md'}>
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
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">Locked — Unlock Profile</span>
                  )
                }
              />
              {canViewProfileDetails && candidate.expectedSalary != null && (
                <DetailRow 
                  label="Expected Salary" 
                  value={
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg">
                      ₹{candidate.expectedSalary.toLocaleString()} / Annum
                    </span>
                  } 
                />
              )}
            </dl>
          </CardContent>
        </Card>

        {/* 4. Notes Segment block (Full width span if exposed) */}
        {canViewProfileDetails && !isContactHidden && candidate.notes && (
          <Card className="lg:col-span-2 rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-5 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
              <CardTitle className="text-base font-bold tracking-tight">Additional Candidate Annotations</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">{candidate.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* 5. Documents / Credentials Portfolio Section List Grid */}
        {canViewProfileDetails && (
          <Card className="lg:col-span-2 rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-5 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <FileCheck className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Verification Documentation</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground/80">Indexed portfolio files ({candidate.documents?.length || 0})</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {candidate.documents?.length === 0 ? (
                <p className="text-sm font-medium text-muted-foreground text-center py-6">No background verification files or resumes uploaded onto this candidate card node.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {candidate.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/doc flex items-center gap-3 rounded-xl border border-slate-200/70 p-4 transition-all bg-card hover:border-indigo-500/40 hover:bg-slate-50/30 dark:hover:bg-slate-900/20 shadow-2xs hover:shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover/doc:scale-105 transition-transform">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover/doc:text-indigo-600 transition-colors">{doc.name}</p>
                        <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-0.5">
                          <span>View Link</span> 
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/50 transition-transform group-hover/doc:translate-x-0.5" />
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 6. Legal / Outreach Request Messaging Pipeline Form Segment */}
        {candidate.canSendInterest && (
          <Card className="lg:col-span-2 rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm border-l-4 border-l-indigo-500">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-5 bg-gradient-to-b from-slate-50/50 via-background to-background dark:from-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Send className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Outreach Intent Request Pipeline</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground/80">Notify and ping applicant about vacant career configurations within your enterprise workspace</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {hasSentInterest ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 flex gap-3 text-xs font-semibold text-emerald-800 dark:text-emerald-400 leading-relaxed shadow-3xs animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-300 text-[10px] mb-0.5">Intent Packet Dispatched</p>
                    <p className="font-medium text-muted-foreground">
                      An interest notification request package was dispatched onto <strong className="text-foreground">{formatDate(interestStatus.createdAt)}</strong> regarding the allocation of the <span className="bg-emerald-500/10 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{interestStatus.positionOffered}</span> vacancy tier. The talent asset will be prompted for communication releases.
                    </p>
                  </div>
                </div>
              ) : showInterestForm ? (
                <form onSubmit={handleInterestSubmit} className="space-y-4 max-w-xl animate-in fade-in duration-200">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90">Issuing Institution Title</Label>
                      <Input value={school?.schoolName || ''} disabled className="rounded-xl h-11 border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed dark:bg-slate-900/40" />
                    </div>
                    <div className="space-y-1.5 group">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">Position Offered *</Label>
                      <Input
                        value={interestForm.positionOffered}
                        onChange={(e) => setInterestForm({ ...interestForm, positionOffered: e.target.value })}
                        placeholder="e.g. Mathematics Teacher"
                        className="rounded-xl h-11 border-slate-200 focus-visible:ring-indigo-500 font-medium"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 group">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 transition-colors">Custom Onboarding Context Message *</Label>
                    <Textarea
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                      placeholder="Introduce your school branding values, operational packages, and specific timeline milestones..."
                      className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 pl-4 pt-3 transition-all min-h-[110px]"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2.5 pt-2">
                    <Button 
                      type="submit" 
                      disabled={interestMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl h-11 px-5 shadow-sm hover:shadow-md transition-all gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{interestMutation.isPending ? 'Dispatching...' : 'Dispatch Intent Request'}</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowInterestForm(false)}
                      className="rounded-xl h-11 px-4 font-semibold hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 max-w-2xl animate-in fade-in duration-200">
                  <p className="text-xs font-medium text-muted-foreground/90 leading-relaxed">
                    Trigger an outbound evaluation sequence to immediately alert this talent asset. Once the candidate signs off or responds, their private data lines open up onto your workspace console pipeline automatically.
                  </p>
                  <Button 
                    onClick={() => setShowInterestForm(true)}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 text-white font-bold h-11 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 gap-2 text-xs uppercase tracking-wider px-5"
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