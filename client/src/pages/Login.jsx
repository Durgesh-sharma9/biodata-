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
  ShieldCheck, 
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

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#FAFBFC] text-slate-800 font-sans antialiased selection:bg-violet-600 selection:text-white relative flex flex-col justify-between items-center px-4 py-3 sm:py-5">
      
      {/* 1. Signature Homepage Floating Bubble Orbs */}
      <FloatingBubbles />

      {/* 2. Soft Ambient Radial Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-500/15 via-indigo-500/10 to-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 3. Top Floating Utility Bar (No full navbar, just clean floating pills) */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between shrink-0">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 shadow-2xs backdrop-blur-md transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Home</span>
        </Link>

        <Link 
          to={signupLink} 
          className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-800 px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100/80 border border-violet-200/80 shadow-2xs backdrop-blur-md transition-all cursor-pointer"
        >
          <span>Register School</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 4. Center Auth Card (Fits perfectly in viewport without scrolling) */}
      <div className="relative z-10 w-full max-w-[420px] my-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(8,41,92,0.12)] border border-slate-200/90 space-y-4 sm:space-y-5">
          
          {/* Card Top: Brand Icon + Title */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex flex-col items-center group">
              <img
                src="/hirehub-brand-icon.png?v=5"
                alt="HireHub Logo"
                className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="mt-1 flex flex-col items-center">
                <span className="text-2xl font-black tracking-tight text-[#08295C] font-sans leading-tight">
                  Hire<span className="text-[#12B9A5]">Hub</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
                  School Staff Recruitment OS
                </span>
              </div>
            </Link>

            <div className="pt-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Direct School Faculty &amp; Staff Recruitment Portal
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-600 border border-rose-200 p-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
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
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
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
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
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
            <div className="pt-1.5 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
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
              <div className="relative flex items-center justify-center py-0.5">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Or
                </span>
              </div>

              {/* Google Sign In */}
              <div className="flex justify-center w-full">
                <GoogleLoginButton targetRole="school_admin" redirectTo={redirectTo} />
              </div>
            </div>

          </form>

          {/* Switch to Signup */}
          <div className="pt-2 text-center text-xs text-slate-500 font-medium border-t border-slate-100">
            Don't have a school account?{' '}
            <Link to={signupLink} className="text-violet-600 font-bold hover:underline">
              Register Free
            </Link>
          </div>

        </div>
      </div>

      {/* 5. Minimal Bottom Footer Note (Single compact line, zero scroll) */}
      <div className="relative z-10 w-full max-w-md text-center shrink-0 pb-1">
        <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted &bull; Direct School Privacy</span>
        </p>
      </div>

    </div>
  );
}