import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import ArtisticAuthVisual from '@/components/common/ArtisticAuthVisual';
import { 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowLeft
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
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans selection:bg-violet-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: IMAGE + MOVING GEOMETRIC ELEMENTS (ONE SIDE ONLY)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[52%] xl:w-[55%] min-h-screen sticky top-0 border-r border-slate-100 flex-col">
        <ArtisticAuthVisual 
          headline="Changing the way" 
          highlight="schools hire staff"
          subtext="Direct faculty recruitment, zero paper biodatas, and 100% verified credentials for India's reputed educational institutions."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: CLEAN, MINIMALIST SIGN IN FORM
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen flex flex-col justify-between items-center p-6 sm:p-10 lg:p-14 bg-white relative z-10 overflow-y-auto">
        
        {/* Top bar with back button & mobile brand */}
        <div className="w-full max-w-[390px] flex items-center justify-between pb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <div className="md:hidden flex items-center gap-2">
            <img 
              src="/hirehub-brand-icon.png?v=5" 
              alt="HireHub Logo" 
              className="w-7 h-7 object-contain" 
            />
            <span className="text-lg font-black text-[#08295C]">
              Hire<span className="text-[#12B9A5]">Hub</span>
            </span>
          </div>
        </div>

        {/* Center Minimal Form Box */}
        <div className="w-full max-w-[390px] my-auto py-4 space-y-6">
          
          {/* Top Brand Logo / Colorful Glyph */}
          <div className="flex flex-col items-center justify-center text-center">
            <Link to="/" className="inline-block group mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-sky-400 p-[2px] shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <img 
                    src="/hirehub-brand-icon.png?v=5" 
                    alt="HireHub" 
                    className="w-9 h-9 object-contain" 
                  />
                </div>
              </div>
            </Link>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Login
            </h1>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <div className="w-full flex justify-center">
            <GoogleLoginButton targetRole="school_admin" redirectTo={redirectTo} text="signin_with" />
          </div>

          {/* Muted Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-slate-200/80"></div>
            <span className="absolute bg-white px-3 text-xs text-slate-400 font-normal">
              Or sign in with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            
            {/* Email Field - Soft container input */}
            <div className="space-y-1">
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full h-12 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs font-semibold text-rose-500 px-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field - Soft container input with eye toggle */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full h-12 px-4 pr-11 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-rose-500 px-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 accent-violet-600 cursor-pointer"
                />
                <span className="font-medium text-slate-700">Keep me logged in</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-[#4E66F8] hover:text-violet-700 hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-[#6355F6] hover:bg-[#5244E6] text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>

            {/* Switch to Sign up Link */}
            <div className="text-center text-xs text-slate-500 pt-2">
              Don't have an account?{' '}
              <Link to={signupLink} className="text-[#4E66F8] font-bold hover:underline">
                Sign up
              </Link>
            </div>

          </form>

        </div>

        {/* Footer info */}
        <div className="text-center pt-4 pb-2 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} HireHub &bull; School Staff Recruitment OS</span>
        </div>

      </div>

    </div>
  );
}