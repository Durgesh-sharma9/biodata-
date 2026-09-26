import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApplicant } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLoginButton } from '@/components/common/GoogleLoginButton';
import { Briefcase, GraduationCap, Mail, Lock, Building2, ArrowLeft } from 'lucide-react';

export default function ApplicantLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <nav className="w-full h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A05AFF] to-[#7928CA] flex items-center justify-center text-white shadow-md shadow-[#A05AFF]/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Hire<span className="text-[#A05AFF]">Hub</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Candidate Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1BCFB4] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <Link to="/login">
              <Button variant="outline" className="text-xs font-bold text-slate-700 border-slate-300">
                <Building2 className="w-3.5 h-3.5 mr-1" /> School Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Colorful Ambient Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-tr from-[#1BCFB4]/25 to-[#A05AFF]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-br from-[#A05AFF]/25 to-[#FE7096]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Back button above card */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#1BCFB4] hover:border-[#1BCFB4]/50 text-xs font-bold shadow-xs transition-all group backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#1BCFB4]" />
              <span>Back</span>
            </button>
            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-[#1BCFB4] transition-colors">
              Back to Home
            </Link>
          </div>

          <Card className="w-full rounded-2xl border border-slate-200/90 shadow-2xl bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 dark:border-slate-800">
            <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1BCFB4]/30 bg-[#1BCFB4]/10 text-[#1BCFB4] text-[11px] font-bold uppercase tracking-wider mb-2 self-center">
              <GraduationCap className="w-3.5 h-3.5" /> Educator &amp; Staff Login
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">
              Candidate Login
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              View your interview invites, documents, and school interest requests
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-3">
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
                    type="password" 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    required 
                    placeholder="••••••••"
                    className="h-11 pl-11 pr-4 rounded-xl"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-[#1BCFB4] to-[#07cdae] hover:from-[#16B59D] hover:to-[#05b297] text-white font-bold rounded-xl shadow-lg shadow-[#1BCFB4]/25 text-xs mt-1" 
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
                <Link to="/join" className="text-[#1BCFB4] font-bold hover:underline">
                  Register for Free
                </Link>
              </p>
              <p>
                School Admin?{' '}
                <Link to="/login" className="text-[#A05AFF] font-bold hover:underline">
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
