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
  AlertCircle,
  Home
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

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-800 font-sans antialiased selection:bg-violet-600 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. Signature Homepage Floating Bubble Orbs */}
      <FloatingBubbles />

      {/* 2. Soft Ambient Radial Glows (Exact Homepage Palette) */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ─────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR (Exact Landing Page Header Experience)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group py-1">
            <img
              src="/hirehub-brand-icon.png?v=5"
              alt="HireHub Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#08295C] font-sans leading-tight">
                Hire<span className="text-[#12B9A5]">Hub</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-wider uppercase -mt-0.5">
                School Staff Recruitment OS
              </span>
            </div>
          </Link>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-slate-500 font-medium">New school?</span>
              <Link to={signupLink}>
                <Button className="h-9 sm:h-10 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-violet-500/25 transition-all cursor-pointer">
                  Register School Free
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (Luminous UI Widgets Showcase + Form)
      ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ─────────────────────────────────────────────────────────
              LEFT COLUMN: SAAS PRODUCT SHOWCASE (No Cartoon Image)
              - Pure High-End Interactive UI Widgets
          ───────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-7 pr-4">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-200 bg-white shadow-2xs backdrop-blur-md self-start">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-700">
                150+ Schools Active Across India
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-[#08295C] leading-[1.15]">
                Welcome Back to Your{' '}
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Recruitment OS
                </span>
              </h1>
              <p className="text-sm xl:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
                Direct walk-in QR standees, digital teacher applications, and your private candidate vault. Zero paper biodatas and zero agency fees.
              </p>
            </div>

            {/* WIDGET CARD 1: LIVE CANDIDATE VAULT PREVIEW */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(8,41,92,0.06)] space-y-4 max-w-xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Live Verified Candidate Pool
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">Ready for immediate campus interview</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  2,480+ Teachers
                </span>
              </div>

              {/* Candidate Mini Rows */}
              <div className="space-y-2">
                {[
                  { name: 'Priya Sharma', role: 'PGT Mathematics', exp: '5 Yrs Exp', quals: 'M.Sc, B.Ed', status: 'Verified' },
                  { name: 'Rajesh Verma', role: 'TGT Science', exp: '3 Yrs Exp', quals: 'B.Sc, B.Ed, CTET', status: 'Verified' },
                  { name: 'Ananya Sen', role: 'Computer Science & AI', exp: '4 Yrs Exp', quals: 'MCA', status: 'Verified' },
                ].map((cand, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-violet-50/40 border border-slate-100 hover:border-violet-200 transition-all text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                        {cand.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">{cand.name}</span>
                        <span className="text-[11px] text-slate-500">{cand.role} &bull; {cand.quals}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">{cand.exp}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {cand.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metric Highlights Strip */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-violet-50/60 border border-violet-100 text-center">
                  <div className="text-sm font-black text-violet-700">3x Faster</div>
                  <div className="text-[10px] font-medium text-slate-500">Shortlisting Speed</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <div className="text-sm font-black text-emerald-700">0% Commission</div>
                  <div className="text-[10px] font-medium text-slate-500">Direct Contact</div>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-center">
                  <div className="text-sm font-black text-sky-700">100% Private</div>
                  <div className="text-[10px] font-medium text-slate-500">School Vault</div>
                </div>
              </div>

            </div>

            {/* WIDGET CARD 2: GATE QR CODE STANDEE (Bento Feature Card) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(8,41,92,0.06)] flex items-center gap-4 max-w-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Gate Walk-In QR Standee
                  </h4>
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                    Print Ready PDF
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Placed at your school gate or reception. Candidates scan with their phone and submit verified biodatas straight to your dashboard.
                </p>
              </div>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Free For Schools
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Instant Setup in 2 Mins
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Confidential Candidate Vault
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────
              RIGHT COLUMN: SIGN IN CARD (Mobile & Desktop)
              - Crisp, elevated, landing page card design
          ───────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            
            {/* The Elevated White Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_15px_45px_-10px_rgba(8,41,92,0.08)] relative space-y-6">
              
              {/* Card Top: Back button on mobile + Heading */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back</span>
                  </Link>

                  <div className="text-xs font-medium text-slate-500">
                    New school?{' '}
                    <Link to={signupLink} className="text-violet-600 font-bold hover:underline">
                      Sign up
                    </Link>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#08295C] tracking-tight">
                    Sign In
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Enter your school email &amp; password
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 p-3.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                      className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
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
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
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
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
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
                    <div className="w-full border-t border-slate-200" />
                    <span className="absolute bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
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
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted &bull; Direct School Privacy</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          PAGE FOOTER (Subtle & Clean)
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <div>
            &copy; {new Date().getFullYear()} HireHub OS &bull; Direct School Faculty &amp; Staff Recruitment
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}