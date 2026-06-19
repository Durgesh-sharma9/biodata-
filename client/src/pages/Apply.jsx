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

  // Flat Micro-Spinner Page Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-5 bg-[#f3f3f4] dark:bg-slate-950 antialiased">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 shadow-sm mb-3 animate-in fade-in duration-300">
          <Loader2 className="h-5 w-5 text-[#A05AFF] animate-spin" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
          Syncing portal gateways...
        </p>
      </div>
    );
  }

  // Fallback Error Component State using Soft-Tint Badging layout constraints
  if (error || !school) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f4] dark:bg-slate-950 p-5 antialiased">
        <Card className="max-w-md rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <CardContent className="p-5 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496]">
              <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Application Link Expired</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                The targeted institutional route is unavailable. Please verify the URL string parameter or get in touch with the administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success Confirmation State using Soft-Tint Success Badging specs
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f4] dark:bg-slate-950 p-5 antialiased">
        <Card className="max-w-md rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4]">
              <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Application Received!</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                Thank you for applying to <span className="font-bold text-slate-800 dark:text-slate-200">{school.schoolName}</span>. Your profile bundle is safely locked inside our talent cloud dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f4] dark:bg-slate-950 p-5 flex items-center justify-center antialiased">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {/* Main Application Base Profile Hub Container */}
        <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl shrink-0">
                    <School className="h-4 w-4 stroke-[2.2]" />
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                    Apply to {school.schoolName}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-xl">
                  Complete the professional entry options profile block grid below. Your registration files will index instantly onto this institution's secure global matrix tracker.
                </CardDescription>
              </div>

              {/* Secure Channel Badge Pillar (Modern Soft-Tint) */}
              <div className="self-start sm:self-center shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-none">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Secure Channel</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-5 bg-white dark:bg-slate-900">
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
              /* Flat procedural Shimmer Skeleton fallback track for missing feeds */
              <div className="space-y-5 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl md:col-span-2" />
                  <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                </div>
                <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Subtle Network Security Footer Mark */}
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
            <span>Powered by HireHub Recruitment Ecosystem Network Infrastructure</span>
          </p>
        </div>

      </div>
    </div>
  );
}