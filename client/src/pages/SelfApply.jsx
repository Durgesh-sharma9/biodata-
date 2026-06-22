import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitPublicApplication, uploadPublicFiles, getSettings, getPositions } from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, Building2, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';

export default function SelfApply() {
  const [submitted, setSubmitted] = useState(false);

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: positions, isLoading: isLoadingPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: submitPublicApplication,
    onSuccess: () => setSubmitted(true),
  });

  const isFormLoading = isLoadingSettings || isLoadingPositions;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f4] p-5 antialiased text-slate-800 dark:bg-slate-950">
        <Card className="max-w-md w-full rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] rounded-xl flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Application Submitted!</h2>
              <div className="inline-block border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                Profile Active
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Thank you for joining the School Recruitment Network. Schools can now discover your comprehensive profile portfolio dynamically inside the platform talent pool.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f4] p-5 antialiased text-slate-800 flex flex-col justify-center relative dark:bg-slate-950 max-w-[1400px] mx-auto w-full">
      <div className="mx-auto max-w-2xl w-full relative space-y-6">
        
        {/* Page Header Panels Layout Layout */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 group">
            <div className="p-2 border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
              HireHub
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Candidate Network Portal
          </div>
        </div>

        {/* Standard Container & Form Matrix Block */}
        <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
          <HeaderWrapper className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold tracking-wide text-slate-800 dark:text-slate-200">
              Join the School Recruitment Network
            </CardTitle>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
              Submit your professional profile to be instantly discovered by premier educational institutions across the network grid. No login required.
            </p>
          </HeaderWrapper>
          
          <CardContent className="p-5">
            {isFormLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="h-7 w-7 text-[#A05AFF] animate-spin relative z-10" />
                  <div className="absolute inset-0 bg-[#A05AFF]/10 rounded-full blur-md animate-pulse scale-150" />
                </div>
                <p className="text-slate-400 font-semibold tracking-wide text-xs">
                  Assembling structural form parameters...
                </p>
              </div>
            ) : settings && positions ? (
              /* Bound variables and form controls injected tightly to violet configurations */
              <div className="prose prose-slate max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight
                prose-labels:text-[11px] prose-labels:font-bold prose-labels:uppercase prose-labels:tracking-wider prose-labels:text-slate-400 dark:prose-labels:text-slate-500
                prose-inputs:h-11 prose-inputs:rounded-xl prose-inputs:border-slate-200 prose-inputs:bg-white prose-inputs:text-sm prose-inputs:transition-all
                prose-inputs:focus:bg-white prose-inputs:focus-visible:ring-2 prose-inputs:focus-visible:ring-[#A05AFF] prose-inputs:focus-visible:border-[#A05AFF]/50
                prose-select:h-11 prose-select:rounded-xl prose-select:border-slate-200 prose-select:bg-white prose-select:text-sm prose-select:transition-all
                prose-select:focus:bg-white prose-select:focus-visible:ring-2 prose-select:focus-visible:ring-[#A05AFF] prose-select:focus-visible:border-[#A05AFF]/50
                prose-textarea:rounded-xl prose-textarea:border-slate-200 prose-textarea:bg-white prose-textarea:text-sm prose-textarea:transition-all
                prose-textarea:focus:bg-white prose-textarea:focus-visible:ring-2 prose-textarea:focus-visible:ring-[#A05AFF] prose-textarea:focus-visible:border-[#A05AFF]/50
                prose-buttons:h-11 prose-buttons:rounded-xl prose-buttons:font-bold prose-buttons:text-xs prose-buttons:tracking-wide
              ">
                <DynamicCandidateForm
                  onSubmit={(data) => submitMutation.mutate(data)}
                  settings={settings}
                  positions={positions}
                  isLoading={submitMutation.isPending}
                  submitButtonText="Submit Application Pipeline"
                  showConsent
                  uploadFilesFn={uploadPublicFiles}
                />
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-50 text-center text-xs font-medium text-slate-400 border border-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500">
                Failed to resolve environmental data constants. Please reload your workspace matrix.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modern Soft-Tint Badge Footers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Encrypted Data Custody Protection
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider dark:text-slate-500">
            <span className="hover:text-[#A05AFF] transition-colors cursor-pointer flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Network SLA Code
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

const HeaderWrapper = CardHeader;