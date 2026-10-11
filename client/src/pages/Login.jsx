import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import FloatingBubbles from '@/components/common/FloatingBubbles';
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Check, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  QrCode, 
  Zap, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { GoogleLoginButton } from '@/components/common/GoogleLoginButton';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function getPostLoginRoute(role) {
  if (role === 'super_admin') return '/admin/dashboard';
  if (role === 'self_applicant' || role === 'applicant') return '/applicant/dashboard';
  return '/dashboard';
}

export default function Login({ redirectTo, signupLink = '/signup' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const emailValue = watch('email');
  const isEmailValid = emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const onSubmit = async (data) => {
    try {
      setError('');
      const cleanEmail = (data.email || '').trim().toLowerCase();
      const cleanPassword = (data.password || '').trim();
      const result = await login(cleanEmail, cleanPassword);
      navigate(redirectTo || getPostLoginRoute(result.user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans antialiased text-slate-800">
      
      {/* 1. Signature Homepage Floating Bubble Orbs */}
      <FloatingBubbles />

      {/* 2. Soft Ambient Radial Glows (matching homepage palette) */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Main SaaS Dual-Card Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT PANEL: RICH HIREHUB RECRUITMENT OS HERO SHOWCASE
            (Inspired by Homepage: Navy + Teal + Glassmorphism Cards)
            - Only visible on Desktop (lg:), keeping mobile ultra-clean
        ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-8 xl:p-12 rounded-3xl bg-gradient-to-br from-[#08295C] via-[#0E2A5E] to-[#1E1B4B] text-white shadow-2xl border border-white/10 relative overflow-hidden min-h-[640px]">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#12B9A5]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl pointer-events-none" />

          {/* Top Header: Brand Logo & Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/hirehub-brand-icon.png?v=5"
                alt="HireHub Logo"
                className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-tight font-sans tracking-tight">
                  Hire<span className="text-[#12B9A5]">Hub</span>
                </span>
                <span className="text-[10px] font-bold text-violet-200 uppercase tracking-wider">
                  School Staff Recruitment OS
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>150+ Schools Active</span>
            </span>
          </div>

          {/* Middle Body: Punchy Tagline & Floating Showcase Badges */}
          <div className="relative z-10 my-auto py-8 space-y-6">
            <div className="space-y-2.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12B9A5]/20 text-[#12B9A5] text-xs font-bold border border-[#12B9A5]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Educator Recruitment</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
                Hire Verified Teachers &amp; Staff in Minutes, Not Weeks.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Eliminate paper biodatas and agency commissions. Access a searchable digital vault of qualified teachers ready for direct campus interviews.
              </p>
            </div>

            {/* Interactive Live Proof Showcase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
              {/* Card 1: Live Pool Strength */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg space-y-2 transition-all hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Live Candidate Pool
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-2xl font-black text-white">2,480+</div>
                <p className="text-[11px] text-slate-300 font-medium">
                  PGT, TGT, PRT, activity teachers & admin staff ready to join.
                </p>
              </div>

              {/* Card 2: Zero Agency Fee */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg space-y-2 transition-all hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#12B9A5] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Hiring
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    0% Commission
                  </span>
                </div>
                <div className="text-2xl font-black text-white">Zero Fees</div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Connect directly via Phone & WhatsApp with candidate profiles.
                </p>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-cyan-300" /> Walk-In Standee QR Code
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> 3x Faster Shortlisting
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> 100% Verified Credentials
              </span>
            </div>
          </div>

          {/* Bottom Footer inside showcase */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>&copy; {new Date().getFullYear()} HireHub OS &bull; All rights reserved</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT PANEL: SIGN IN FORM CARD (Clean, Modern & Responsive)
            - Seamless on Mobile (100% width) and Desktop (lg:col-span-6)
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 xl:p-9 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
            
            {/* Top Navigation Row: Back Button & Switch to Signup */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 bg-white/80 dark:bg-slate-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>

              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                New school?{' '}
                <Link to={signupLink} className="text-violet-600 dark:text-violet-400 font-bold hover:underline">
                  Sign up
                </Link>
              </div>
            </div>

            {/* Mobile-Only Header Brand Bar */}
            <div className="lg:hidden flex items-center gap-3 pt-1 pb-1 border-b border-slate-100 dark:border-slate-800">
              <img 
                src="/hirehub-brand-icon.png?v=5" 
                alt="HireHub Logo" 
                className="w-9 h-9 object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 dark:text-white leading-tight font-sans">
                  Hire<span className="text-[#12B9A5]">Hub</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  School Staff Recruitment OS
                </span>
              </div>
            </div>

            {/* Page Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Direct School Faculty &amp; Staff Recruitment Portal
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 p-3.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Official School Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. principal@school.edu.in"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all shadow-2xs"
                    {...register('email')}
                  />
                  {isEmailValid && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs font-semibold text-rose-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all shadow-2xs"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-semibold text-rose-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Or
                  </span>
                </div>

                {/* Google Sign In */}
                <div className="flex justify-center w-full">
                  <GoogleLoginButton targetRole="school_admin" redirectTo={redirectTo} />
                </div>
              </div>

            </form>

            {/* Bottom Security Note */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>256-Bit SSL Encrypted &bull; Direct School Privacy</span>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}