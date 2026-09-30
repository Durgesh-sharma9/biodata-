import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2, AlertTriangle, Loader2, School, GraduationCap, ShieldCheck, Building2, MapPin, Phone, Mail, MessageSquare, RotateCcw, Globe, Clock, Award, Calendar } from 'lucide-react';
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
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-5 bg-[#F4F7F6] dark:bg-slate-950 antialiased">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 shadow-sm mb-3 animate-in fade-in duration-300">
          <Loader2 className="h-5 w-5 text-[#0F766E] animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">
          Loading application portal...
        </p>
      </div>
    );
  }

  // Fallback Error Component State using Soft-Tint Badging layout constraints
  if (error || !school) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7F6] dark:bg-slate-950 p-5 antialiased">
        <Card className="max-w-md rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <CardContent className="p-5 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496]">
              <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Application Link Expired</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                This application link is invalid or has expired. Please check the URL or contact the school administration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success Confirmation State with Rich School Identity
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7F6] dark:bg-slate-950 p-4 sm:p-6 antialiased">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden text-center animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header Banner with School Identity */}
          <div className="bg-gradient-to-r from-teal-50/80 via-slate-50 to-teal-50/80 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/80 p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center gap-3">
              {school.logoUrl ? (
                <img
                  src={school.logoUrl}
                  alt={school.schoolName}
                  className="h-16 w-16 object-contain rounded-2xl p-1 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.innerHTML = '<div class="h-16 w-16 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-black text-xl shadow-xs">SCH</div>';
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 flex items-center justify-center font-black text-xl shadow-xs">
                  {school.schoolName ? school.schoolName.charAt(0).toUpperCase() : <Building2 className="h-8 w-8" />}
                </div>
              )}

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {school.schoolName}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                  {(school.city || school.state) && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {[school.city, school.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F766E] bg-[#0F766E]/10 px-2.5 py-0.5 rounded-full border border-[#0F766E]/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified School
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Badge & Message */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="inline-flex p-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200/80 dark:border-emerald-800 shadow-xs">
              <CheckCircle2 className="h-9 w-9 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Application Submitted Successfully!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Your biodata has been securely received by {school.schoolName}'s recruitment team.
              </p>
            </div>

            {/* Custom Welcome / Thank You Message from School */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-left relative overflow-hidden">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#0F766E]" /> Message from School Administration
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line italic">
                "{school.customWelcomeMessage || 'Thank you for applying to our school. Our recruitment team will review your application soon.'}"
              </p>
            </div>

            {/* Recruitment Desk & Walk-In Contacts */}
            {(school.hrContactPerson || school.altPhone || school.walkInTimings) && (
              <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 text-xs text-left space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Recruitment Desk Information
                </div>
                {school.hrContactPerson && (
                  <div className="text-slate-700 dark:text-slate-200 font-medium">
                    <span className="text-slate-400">Recruiter In-Charge:</span> {school.hrContactPerson}
                  </div>
                )}
                {school.walkInTimings && (
                  <div className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#0F766E] shrink-0" />
                    <span>Reception / Walk-In Timings: {school.walkInTimings}</span>
                  </div>
                )}
                {school.altPhone && (
                  <div className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp / Direct Inquiry: {school.altPhone}</span>
                  </div>
                )}
              </div>
            )}

            {/* School Contact Footer Info */}
            {(school.phone || school.email || school.address) && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {school.phone && (
                    <a href={`tel:${school.phone}`} className="inline-flex items-center gap-1.5 hover:text-[#0F766E] transition-colors">
                      <Phone className="h-3.5 w-3.5 text-[#0F766E]" /> {school.phone}
                    </a>
                  )}
                  {school.email && (
                    <a href={`mailto:${school.email}`} className="inline-flex items-center gap-1.5 hover:text-[#0F766E] transition-colors">
                      <Mail className="h-3.5 w-3.5 text-[#0F766E]" /> {school.email}
                    </a>
                  )}
                </div>
                {school.address && (
                  <p className="text-[11px] text-slate-400 text-center">
                    {school.address}
                  </p>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Submit Another Application
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] dark:bg-slate-950 p-3 sm:p-5 md:p-6 flex items-center justify-center antialiased">
      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Main Application Base Profile Hub Container */}
        <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {school.logoUrl ? (
                  <div className="h-12 w-12 rounded-xl border border-slate-200/80 bg-white p-1 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={school.logoUrl}
                      alt={school.schoolName}
                      className="h-full w-full object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = '<span class="text-xs font-black text-[#0F766E]">SCH</span>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-[#0F766E]/10 text-[#0F766E] rounded-xl shrink-0">
                    <School className="h-5 w-5 stroke-[2.2]" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                      Apply to {school.schoolName}
                    </CardTitle>
                    {school.boardAffiliation && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
                        <Award className="h-3 w-3" /> {school.boardAffiliation}
                      </span>
                    )}
                    {school.schoolLevel && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {school.schoolLevel}
                      </span>
                    )}
                    {school.establishedYear && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Est. {school.establishedYear}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                    {(school.city || school.state) && (
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {[school.city, school.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {school.website && (
                      <a 
                        href={school.website.startsWith('http') ? school.website : `https://${school.website}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#0F766E] hover:underline font-medium"
                      >
                        <Globe className="h-3 w-3" /> Official Website
                      </a>
                    )}
                    {school.walkInTimings && (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" /> {school.walkInTimings}
                      </span>
                    )}
                  </div>

                  {school.aboutSchool && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800 mt-1 italic">
                      "{school.aboutSchool}"
                    </p>
                  )}

                  <CardDescription className="text-xs font-medium text-slate-500 leading-relaxed max-w-xl pt-0.5">
                    Please fill in your details below. Your application and resume will be submitted directly to {school.schoolName}'s recruitment team for review.
                  </CardDescription>
                </div>
              </div>

              {/* Secure Channel Badge Pillar (Modern Soft-Tint) */}
              <div className="self-start sm:self-center shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0F766E]/30 bg-[#0F766E]/5 text-[#0F766E] font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-none">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified School</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-5 bg-white dark:bg-slate-900">
            {(school?.settings || settings) && positions ? (
              <DynamicCandidateForm
                onSubmit={(data) => submitMutation.mutate(data)}
                settings={school?.settings || settings}
                positions={school?.settings?.positions || positions}
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
            <span>Powered by HireHub</span>
          </p>
        </div>

      </div>
    </div>
  );
}