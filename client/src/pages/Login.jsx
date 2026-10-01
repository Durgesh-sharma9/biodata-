import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  ArrowRight,
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Check, 
  KeyRound,
  GraduationCap,
  Building2,
  Zap,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck
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
      const result = await login(data.email, data.password);
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
    <div className="min-h-screen lg:h-screen w-full flex flex-col md:flex-row bg-[#AFC6FF] font-sans selection:bg-[#4E66F8] selection:text-white overflow-x-hidden lg:overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: FULL-HEIGHT RICH HIREHUB RECRUITMENT SHOWCASE
          (Seamless organic contour: 100% continuous SVG, ZERO notches/steps)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[44%] xl:w-[42%] min-h-screen lg:h-screen relative flex-col justify-between p-6 lg:p-10 select-none shrink-0 overflow-visible">
        
        {/* Unified Continuous SVG Background */}
        <div className="absolute inset-0 -right-14 h-full w-[calc(100%+56px)] pointer-events-none z-0 overflow-visible">
          <svg className="w-full h-full" viewBox="0 0 500 1000" fill="none" preserveAspectRatio="none">
            {/* 1. Base Cobalt Blue Body with smooth inward slope and elegant flared bottom */}
            <path 
              d="M 0,0 
                 L 460,0 
                 C 455,65 425,140 415,200 
                 C 407,260 398,500 390,640 
                 C 380,750 405,880 455,965 
                 C 468,985 475,1000 475,1000 
                 L 0,1000 Z" 
              fill="#3160E8" 
            />

            {/* 2. Bottom Radiant Sky-Blue Wave (Shares identical right boundary curve) */}
            <path 
              d="M 0,580 
                 C 130,530 260,600 390,640 
                 C 380,750 405,880 455,965 
                 C 468,985 475,1000 475,1000 
                 L 0,1000 Z" 
              fill="#4D8BF8" 
            />

            {/* 3. Subtle Mid-Tone Wave Overlay for aesthetic depth */}
            <path 
              d="M 0,380 
                 C 140,320 280,410 400,450 
                 L 395,490 
                 C 260,450 130,370 0,420 Z" 
              fill="#3868EA" 
              opacity="0.35" 
            />

            {/* 4. Top Dark Royal Header Wave (Smooth inward curve, seamless with base body) */}
            <path 
              d="M 0,0 
                 L 460,0 
                 C 455,65 425,140 415,200 
                 C 335,205 240,175 140,185 
                 C 70,192 25,180 0,182 
                 L 0,0 Z" 
              fill="#20337E" 
            />
          </svg>
        </div>

        {/* Top Header inside showcase: HireHub Logo & OS Brand */}
        <div className="relative z-10 flex items-center justify-between pt-1 sm:pt-2 pr-6 sm:pr-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/hirehub-logo-transparent.png" 
              alt="HireHub Logo" 
              className="h-8 w-auto object-contain drop-shadow-md" 
            />
            <div className="flex flex-col">
              <span className="text-lg font-black text-white leading-none">
                HireHub
              </span>
              <span className="text-[9px] font-bold text-violet-200 uppercase tracking-wider mt-0.5">
                School Staff Recruitment OS
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 mr-2 sm:mr-3">
            <Building2 className="w-3.5 h-3.5 text-amber-300" /> 150+ Schools
          </span>
        </div>

        {/* Floating UI Elements Container (Rich Landing Page Data - Centered with Gentle Floating Motion) */}
        <div className="relative z-10 w-full max-w-[320px] mx-auto flex flex-col items-center justify-center gap-5 my-auto py-4">
          
          {/* FLOATING CARD 1: HIREHUB VERIFIED TEACHER POOL */}
          <div className="relative w-[280px] animate-float-card-primary">
            <div className="w-[230px] bg-white rounded-3xl p-5 shadow-2xl shadow-blue-950/25 transition-transform hover:scale-[1.02] duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Verified Teachers
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Pool
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                2,480+
              </div>
              
              {/* Wavy line chart with verified rate circular badge */}
              <div className="relative h-11 flex items-center">
                <svg className="w-full h-9 overflow-visible" viewBox="0 0 160 40" fill="none">
                  <path 
                    d="M 5 24 Q 25 2, 45 28 T 85 15 T 125 30 T 155 18" 
                    stroke="#F97316" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 45 28 Q 65 38, 85 15 T 115 26" 
                    stroke="#4E66F8" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeLinecap="round" 
                  />
                </svg>
                
                {/* Black circle tag with '98%' */}
                <div className="absolute left-[45%] top-[12px] -translate-x-1/2 -translate-y-1/2 px-1.5 h-6 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  98%
                </div>
              </div>

              {/* Mini Candidate Profile Badges (Landing Page Style) */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="truncate">👩‍🏫 Priya S. • PGT Math</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="truncate">👨‍🏫 Rajesh V. • TGT Science</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                </div>
              </div>
            </div>

            {/* Floating Teacher / Education Badge */}
            <div className="absolute right-0 top-1 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform animate-float-badge-cap">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Floating School Portal Badge */}
            <div className="absolute right-2 top-20 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform animate-float-badge-school">
              <Building2 className="w-5 h-5 text-[#3662E3]" />
            </div>
          </div>

          {/* HIREHUB SPEED & VALUE PILLS (From Landing Page) */}
          <div className="flex items-center justify-center gap-2 w-full max-w-[280px] animate-float-pills">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25">
              <Zap className="w-3 h-3 text-amber-300" /> 3x Faster Hiring
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25">
              <ShieldCheck className="w-3 h-3 text-emerald-300" /> 0% Agency Fees
            </span>
          </div>

          {/* FLOATING CARD 2: DIRECT RECRUITMENT & VERIFICATION */}
          <div className="w-[280px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-blue-950/20 flex gap-3.5 items-center animate-float-card-secondary transition-transform hover:scale-[1.02] duration-300">
            
            {/* Left stacked minimal category lines */}
            <div className="space-y-1.5 shrink-0 w-10">
              <div className="h-2 w-8 bg-[#4E66F8] rounded-full" />
              <div className="h-1.5 w-10 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-6 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-8 bg-slate-100 rounded-full" />
            </div>

            {/* Right: Orange Key Icon & HireHub Direct Hiring Text */}
            <div className="flex-1 min-w-0">
              <div className="w-6 h-6 text-amber-500 mb-1 flex items-center justify-start">
                <KeyRound className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Direct School Hiring
              </h4>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Zero agency commission. 100% verified candidate credentials.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Feature Footer inside showcase */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-violet-100 font-medium">
          <span>&copy; 2025 HireHub &bull; All rights reserved</span>
          <span className="flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Systems Online
          </span>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: SIGN IN BOX SITTING IN THE PERIWINKLE CANVAS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen lg:h-screen lg:max-h-screen flex items-center justify-center p-3 sm:p-5 lg:py-2 lg:px-6 relative z-10">
        
        {/* The White Card / Box */}
        <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl shadow-blue-950/15 p-6 sm:p-9 lg:p-9 relative z-10 border border-white/80">
          
          {/* Top Bar: Circular Back Button & Top Right Switch Link */}
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer bg-white hover:bg-slate-50 shadow-xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-xs sm:text-[13px] font-medium text-slate-400">
              New school?{' '}
              <Link to={signupLink} className="text-[#4E66F8] font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 sm:mb-7">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Sign In
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-400 font-medium mt-1">
              Direct School Faculty &amp; Staff Recruitment Portal
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-600 border border-rose-200 p-3 text-xs font-semibold mb-4">
              {error}
            </div>
          )}

          {/* FORM: Spacious, Clean Underline Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7">
            
            {/* Email Underline Field */}
            <div className="space-y-1.5">
              <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-3">
                <Mail className="w-5 h-5 text-slate-400 mr-3.5 shrink-0" />
                <input
                  id="email"
                  type="email"
                  placeholder="Official School Email"
                  className="w-full bg-transparent text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  {...register('email')}
                />
                {isEmailValid && (
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.email && <p className="text-xs font-semibold text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Password Underline Field */}
            <div className="space-y-1.5">
              <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-3">
                <Lock className="w-5 h-5 text-slate-400 mr-3.5 shrink-0" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  className="w-full bg-transparent text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-semibold text-rose-500">{errors.password.message}</p>}
              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-[13px] font-semibold text-[#4E66F8] hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit & Social Auth */}
            <div className="pt-2 sm:pt-3 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-[#4E66F8] hover:bg-[#3D56EC] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#4E66F8]/25 hover:shadow-[#4E66F8]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="w-full border-t border-slate-200"></div>
                <span className="absolute bg-white px-3 text-xs text-slate-400 font-medium">Or</span>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLoginButton targetRole="school_admin" redirectTo={redirectTo} />
              </div>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}