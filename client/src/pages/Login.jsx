import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  GraduationCap,
  Sparkles 
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

export default function Login({ redirectTo, signupLink = '/signup', title = 'Sign In to HireHub' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setError('');
      const result = await login(data.email, data.password);
      navigate(redirectTo || getPostLoginRoute(result.user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    setError('');
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans antialiased flex flex-col justify-between dark:bg-slate-950 dark:text-slate-200">
      
      {/* NAVBAR */}
      <nav className="w-full h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A05AFF] to-[#7928CA] flex items-center justify-center text-white shadow-md shadow-[#A05AFF]/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Hire<span className="text-[#A05AFF]">Hub</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                School Staff Recruitment
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#A05AFF] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <Link to="/applicant/login">
              <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-[#A05AFF] dark:text-slate-300">
                <GraduationCap className="w-4 h-4 mr-1 text-[#A05AFF]" /> Candidate Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="h-9 rounded-xl bg-[#A05AFF] hover:bg-[#8B3DFF] text-white font-bold text-xs px-4 shadow-sm">
                Register School
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-tr from-[#A05AFF]/25 to-[#FE7096]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-br from-[#1BCFB4]/25 to-[#A05AFF]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Back button above card */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#A05AFF] hover:border-[#A05AFF]/50 text-xs font-bold shadow-xs transition-all group backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#A05AFF]" />
              <span>Back</span>
            </button>
            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-[#A05AFF] transition-colors">
              Back to Home
            </Link>
          </div>

          <Card className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-slate-900/95 dark:border-slate-800 overflow-hidden">
            <CardHeader className="text-center p-6 pb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#A05AFF]/30 bg-[#A05AFF]/10 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider mb-2 self-center">
                <Building2 className="w-3.5 h-3.5" /> School &amp; Admin Portal
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {title}
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium text-xs mt-1">
                Sign in to manage candidates, jobs, and recruitment credits
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-3">

              {/* DEMO CREDENTIALS QUICK FILL CHIPS */}
              <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs dark:bg-slate-800/50 dark:border-slate-700">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A05AFF]" /> Quick Demo Logins (Click to autofill):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@gmail.com', '123456')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#A05AFF] hover:text-[#A05AFF] text-[11px] font-bold text-slate-700 shadow-xs transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                  >
                    🏫 admin@gmail.com
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCredentials('school@demo.com', 'School@123')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#A05AFF] hover:text-[#A05AFF] text-[11px] font-bold text-slate-700 shadow-xs transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                  >
                    🏫 Demo School
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@platform.com', 'Admin@123')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#A05AFF] hover:text-[#A05AFF] text-[11px] font-bold text-slate-700 shadow-xs transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                  >
                    👑 Super Admin
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 p-3.5 text-xs font-semibold flex items-start gap-2.5 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Email Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Official Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@school.com" 
                      className="w-full h-11 pl-11 pr-4 bg-white border-slate-200 rounded-xl text-sm font-medium focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                      {...register('email')} 
                    />
                  </div>
                  {errors.email && <p className="text-xs font-bold text-red-500 pl-1">{errors.email.message}</p>}
                </div>
                
                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full h-11 pl-11 pr-11 bg-white border-slate-200 rounded-xl text-sm font-medium focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                      {...register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs font-bold text-red-500 pl-1">{errors.password.message}</p>}
                </div>
                
                {/* Submit Action */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-[#A05AFF] to-[#7928CA] hover:from-[#8B3DFF] hover:to-[#6820B0] text-white font-bold rounded-xl shadow-lg shadow-[#A05AFF]/25 transition-all text-sm mt-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : 'Sign In To School Dashboard'}
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white dark:bg-slate-900 px-3">Or sign in with</span>
                </div>
              </div>

              <GoogleLoginButton targetRole="school_admin" redirectTo={redirectTo} />

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-center text-xs dark:border-slate-800">
                <p className="text-slate-500 font-medium">
                  New school registering for HireHub?{' '}
                  <Link to={signupLink} className="text-[#A05AFF] hover:underline font-bold">
                    Start Free Trial
                  </Link>
                </p>
                <p className="text-slate-500 font-medium">
                  Are you a Teacher or Job Seeker?{' '}
                  <Link to="/applicant/login" className="text-[#1BCFB4] hover:underline font-bold">
                    Candidate Login here
                  </Link>
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-5 dark:bg-slate-900 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} HireHub Technologies. All systems operational &amp; secure.
      </footer>

    </div>
  );
}