import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import ArtisticAuthVisual, { ArtisticAuthBackground } from '@/components/common/ArtisticAuthVisual';
import FloatingBubbles from '@/components/common/FloatingBubbles';
import { 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Building2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GoogleLoginButton } from '@/components/common/GoogleLoginButton';

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
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

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
    <div className="min-h-screen w-full relative flex flex-col md:flex-row font-sans selection:bg-violet-600 selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          FULL-SCREEN BACKGROUND: RECRUITMENT IMAGE + ARTISTIC SHAPES
          (Spans 100% of the entire viewport, edge-to-edge)
      ───────────────────────────────────────────────────────────── */}
      <ArtisticAuthBackground />

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: EDITORIAL HEADLINE & BADGES (ON TOP OF FULL IMAGE)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[50%] xl:w-[54%] min-h-screen sticky top-0 flex-col shrink-0 min-w-0 z-10">
        <ArtisticAuthVisual 
          headline="Changing the way" 
          highlight="schools hire staff"
          subtext="Direct faculty recruitment, zero paper biodatas, and 100% verified credentials for India's reputed educational institutions."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: MODERN, ELEVATED, RICH FORM CANVAS (MATCHING LANDING THEME)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full md:w-[52%] lg:w-[50%] xl:w-[46%] flex-1 min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 xl:p-12 relative z-10 overflow-hidden min-w-0">
        
        {/* RANDOMLY MOVING BUBBLE ORBS (SAME AS LANDING PAGE, CONTAINED TO RIGHT SIDE ONLY) */}
        <FloatingBubbles embedded={true} />

        {/* Mobile-Only Top Brand Bar */}
        <div className="md:hidden w-full max-w-[440px] flex items-center justify-between pt-2 pb-2 shrink-0 relative z-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/hirehub-brand-icon.png?v=5" 
              alt="HireHub Logo" 
              className="h-8 w-auto object-contain" 
            />
            <span className="text-xl font-black text-[#08295C] leading-none">
              Hire<span className="text-[#12B9A5]">Hub</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700">
            <Building2 className="w-3 h-3 text-amber-500" /> 150+ Schools
          </span>
        </div>

        {/* ─── ELEVATED FLOATING FORM CARD (RICH LIGHT BOX) ─── */}
        <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-white/90 ring-1 ring-slate-200/80 my-auto space-y-5 relative z-20 overflow-hidden">
          
          {/* Top Bar: Back Button & Switch to Signup */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer bg-white hover:bg-slate-50 shadow-2xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-xs font-medium text-slate-500">
              New school?{' '}
              <Link to={signupLink} className="text-violet-600 font-bold hover:text-violet-700 hover:underline">
                Register Free
              </Link>
            </div>
          </div>

          {/* Heading with Brand Badge */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 text-violet-700 text-[11px] font-bold mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
              <Building2 className="w-3 h-3 text-violet-600" />
              <span>School Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Sign In to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
                HireHub
              </span>
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1">
              Enter your credentials to manage faculty recruitment &amp; applicants.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field with clean container & icon */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                Official School Email
              </label>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                <Mail className="w-4 h-4 text-slate-400 ml-3.5 mr-2 shrink-0" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@school.edu.in"
                  className="w-full bg-transparent py-2.5 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  {...register('email')}
                />
                {isEmailValid && (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mr-3">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-rose-500 px-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field with container, icon & show/hide toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                <Lock className="w-4 h-4 text-slate-400 ml-3.5 mr-2 shrink-0" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-2.5 pr-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-3"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-rose-500 px-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 accent-violet-600 cursor-pointer"
                />
                <span className="font-medium text-slate-700">Keep me logged in</span>
              </label>
            </div>

            {/* Primary Submit Button & Google Auth */}
            <div className="pt-2 space-y-3.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Sign In to School Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-slate-200/90" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-slate-200/90" />
              </div>

              <div className="flex justify-center w-full">
                <GoogleLoginButton targetRole="school_admin" redirectTo={redirectTo} text="signin_with" />
              </div>
            </div>

          </form>

        </div>

        {/* Bottom Trust Note */}
        <div className="text-center shrink-0 pt-3 pb-1">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted &bull; Direct School Privacy &bull; Zero Agency Fees</span>
          </p>
        </div>

      </div>

    </div>
  );
}