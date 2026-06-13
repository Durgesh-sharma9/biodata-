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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white p-4 md:p-6 antialiased text-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <Card className="max-w-md w-full border-slate-200/60 shadow-2xl rounded-3xl overflow-hidden bg-white relative z-10 animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />
          <CardContent className="pt-12 pb-10 px-6 sm:px-8 text-center space-y-5">
            <div className="mx-auto w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm animate-scale-in">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Application Submitted!</h2>
              <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 border-emerald-200/50 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                Profile Active
              </Badge>
            </div>

            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Thank you for joining the School Recruitment Network. Schools can now discover your comprehensive profile portfolio dynamically inside the platform talent pool.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white p-4 sm:p-6 lg:p-12 antialiased text-slate-800 flex flex-col justify-center relative selection:bg-indigo-500/10">
      
      {/* Decorative Interactive Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300/10 via-cyan-200/10 to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-purple-300/10 via-pink-200/10 to-transparent rounded-full blur-[130px]" />
      </div>

      <div className="mx-auto max-w-2xl w-full relative z-10 space-y-6">
        
        {/* Brand Banner Identity Wrapper */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-md text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              HireHub<span className="text-indigo-500">.</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-500 fill-indigo-500/20" /> Candidate Network Portal
          </div>
        </div>

        {/* Core Entry Form Card */}
        <Card className="border-slate-200/70 shadow-xl shadow-slate-100/40 rounded-3xl overflow-hidden bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600" />
          
          <HeaderWrapper className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/30">
            <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Join the School Recruitment Network
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 leading-relaxed">
              Submit your professional profile to be instantly discovered by premier educational institutions across the network grid. No login required.
            </p>
          </HeaderWrapper>
          
          <CardContent className="p-6 sm:p-8">
            {isFormLoading ? (
              /* High-end Framework Synced Loading State Layout */
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin relative z-10" />
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-lg animate-pulse scale-150" />
                </div>
                <p className="text-slate-400 font-semibold tracking-wide text-xs">
                  Assembling structural form parameters...
                </p>
              </div>
            ) : settings && positions ? (
              /* Injected Form Module Styles */
              <div className="prose prose-slate max-w-none 
                prose-headings:font-black prose-headings:tracking-tight
                prose-labels:text-[11px] prose-labels:font-bold prose-labels:uppercase prose-labels:tracking-wider prose-labels:text-slate-400
                prose-inputs:h-11 prose-inputs:rounded-xl prose-inputs:border-slate-200 prose-inputs:bg-slate-50/50 prose-inputs:text-sm prose-inputs:transition-all
                prose-inputs:focus:bg-white prose-inputs:focus:ring-4 prose-inputs:focus:ring-indigo-500/10 prose-inputs:focus:border-indigo-500
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
              /* Network Failure Alternative View State */
              <div className="p-6 rounded-xl bg-slate-50 text-center text-xs font-medium text-slate-400 border border-slate-100">
                Failed to resolve environmental data constants. Please reload your workspace matrix.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security / Quality Assurance Trust Badging Footer Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> Encrypted Data Custody Protection
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 transition-colors cursor-pointer flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Network SLA Code
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Internal styling adapter variable to maintain pristine validation syntax compatibility
const HeaderWrapper = CardHeader;