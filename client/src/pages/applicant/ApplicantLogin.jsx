import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApplicant } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLoginButton } from '@/components/common/GoogleLoginButton';
import { Briefcase, GraduationCap, Mail, Lock, Building2, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function ApplicantLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fillCredentials = (email, password) => {
    setForm({ email, password });
    setError('');
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApplicant(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/applicant/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between dark:bg-slate-950">
      
      {/* Top Navbar */}
      <nav className="w-full h-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/hirehub-logo-transparent.png" 
              alt="HireHub Logo" 
              className="h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Hire<span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Hub</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
                Candidate Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span className="hidden sm:inline">Back</span>
            </button>
            <Link to="/login">
              <Button variant="outline" className="h-9 sm:h-10 rounded-xl border-slate-300 text-slate-700 hover:text-violet-600 hover:border-violet-300 font-bold text-xs sm:text-sm px-4">
                <Building2 className="w-3.5 h-3.5 mr-1 text-violet-600" /> School Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-tr from-violet-500/15 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <Card className="w-full rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/50 bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 dark:border-slate-800 dark:shadow-none">
            <CardHeader className="text-center p-6 sm:p-8 pb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-300 text-[11px] font-bold uppercase tracking-wider mb-2 self-center">
              <GraduationCap className="w-3.5 h-3.5 text-violet-600" /> Educator &amp; Staff Login
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Candidate Login
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-500 font-medium">
              View your job applications, verified profile status, and school recruitment requests
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-3">

            {/* QUICK DEMO FILL CHIPS */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs dark:bg-slate-800/50 dark:border-slate-700">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" /> Quick Demo Login (Click to autofill):
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('demo@candidate.com', 'Demo@123')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-[11px] font-bold text-slate-700 shadow-xs transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                >
                  🎓 Demo Candidate
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 p-3 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                    placeholder="you@example.com"
                    className="h-11 pl-11 pr-4 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    required 
                    placeholder="••••••••"
                    className="h-11 pl-11 pr-11 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-xs mt-1" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In as Candidate'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                <span className="bg-white dark:bg-slate-900 px-2">Or continue with</span>
              </div>
            </div>

            <GoogleLoginButton targetRole="self_applicant" redirectTo="/applicant/dashboard" />

            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <p>
                Don't have a candidate account?{' '}
                <Link to="/join" className="text-blue-600 font-bold hover:underline">
                  Register for Free
                </Link>
              </p>
              <p>
                School Admin?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  School Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} HireHub Technologies.
      </footer>

    </div>
  );
}
