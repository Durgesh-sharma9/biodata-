import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2, AlertTriangle, Loader2, School, GraduationCap, ShieldCheck } from 'lucide-react';
import { getSchoolBySlug, submitApplication, uploadPublicFiles, getSettings, getPositions } from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Apply() {
  const { slug } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const { data: school, isLoading, error } = useQuery({
    queryKey: ['apply-school', slug],
    queryFn: () => getSchoolBySlug(slug).then((r) => r.data.data),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: (data) => submitApplication(slug, data),
    onSuccess: () => setSubmitted(true),
  });

  // Premium Micro-Spinner Full Page Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/40 antialiased">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-xl border border-muted/40 mb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 opacity-10 animate-pulse" />
          <Loader2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 animate-pulse">
          Syncing portal gateways...
        </p>
      </div>
    );
  }

  // Premium Fallback Error Component State
  if (error || !school) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 dark:bg-slate-950/40 p-6 antialiased">
        <Card className="max-w-md border-rose-500/20 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="h-1.5 w-full bg-rose-500" />
          <CardContent className="pt-8 pb-6 text-center space-y-4 px-6 sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 shadow-3xs">
              <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-black tracking-tight text-foreground">Application Link Expired</h2>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                The targeted institutional route is unavailable. Please verify the URL string parameter or get in touch with the administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Premium Success Confirmation State Interface Look
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50/60 via-slate-100/30 to-background dark:from-slate-950 dark:to-slate-900 p-6 antialiased">
        <Card className="max-w-md border-emerald-500/20 bg-background shadow-2xl rounded-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="pt-8 pb-8 text-center space-y-4 px-6 sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-sm animate-bounce-short">
              <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Application Received!</h2>
              <p className="text-sm font-medium text-muted-foreground/95 leading-relaxed">
                Thank you for applying to <strong className="text-foreground font-bold">{school.schoolName}</strong>. Your profile bundle is safely locked inside our talent cloud dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/40 to-background dark:from-slate-950 dark:via-background dark:to-slate-950/60 p-4 md:p-8 flex items-center justify-center antialiased">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Main Application Base Profile Hub Container */}
        <Card className="border border-slate-200/60 bg-card shadow-md rounded-2xl overflow-hidden transition-all duration-300">
          <CardHeader className="border-b border-muted/40 bg-gradient-to-b from-slate-50/70 via-background to-background dark:from-slate-950/30 p-6 sm:p-8 relative">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-44 h-44 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-3xs shrink-0">
                    <School className="h-4 w-4 stroke-[2.2]" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Apply to {school.schoolName}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs font-medium text-muted-foreground leading-relaxed max-w-xl pl-0 sm:pl-9">
                  Complete the professional entry options profile block grid below. Your registration files will index instantly onto this institution's secure global matrix tracker.
                </CardDescription>
              </div>

              {/* Secure Channel Badge Pillar */}
              <div className="self-start sm:self-center shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] uppercase tracking-wider rounded-lg border border-indigo-500/10 shadow-3xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Secure Channel</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-8 bg-background">
            {settings && positions ? (
              <DynamicCandidateForm
                onSubmit={(data) => submitMutation.mutate(data)}
                settings={settings}
                positions={positions}
                isLoading={submitMutation.isPending}
                submitButtonText="Submit Application"
                showConsent
                uploadFilesFn={uploadPublicFiles}
              />
            ) : (
              /* High-Fidelity Form Shimmer Placeholder fallback layout if data drops */
              <div className="space-y-6 animate-pulse p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-11 bg-muted/50 rounded-xl sm:col-span-2" />
                  <div className="h-11 bg-muted/40 rounded-xl" />
                  <div className="h-11 bg-muted/40 rounded-xl" />
                </div>
                <div className="h-12 bg-muted/50 rounded-xl w-full mt-4" />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Subtle Network Security Footer Mark */}
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/50 flex items-center justify-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Powered by HireHub Recruitment Ecosystem Network Infrastructure</span>
          </p>
        </div>

      </div>
    </div>
  );
}