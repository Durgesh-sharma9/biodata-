import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupApplicant } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap, Building2, ArrowLeft } from 'lucide-react';

export default function ApplicantSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileSharingConsent: false,
    contactConsent: false,
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

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await signupApplicant(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/applicant/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
                Candidate Registration
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
            <Link to="/signup">
              <Button variant="outline" className="text-xs font-bold text-slate-700 border-slate-300">
                <Building2 className="w-3.5 h-3.5 mr-1" /> Register School
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Colorful Ambient Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-tr from-[#1BCFB4]/20 to-[#A05AFF]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-br from-[#FE7096]/15 to-[#1BCFB4]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="w-full max-w-lg relative z-10">
          
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
              <GraduationCap className="w-3.5 h-3.5" /> 100% Free Candidate Profile
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">
              Create Candidate Account
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              Join the HireHub Talent Pool and get discovered by top schools in your area
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-3">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 p-3 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</Label>
                  <Input 
                    value={form.fullName} 
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                    required 
                    placeholder="e.g. Anjali Sharma"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Number *</Label>
                  <Input 
                    type="tel"
                    value={form.mobile} 
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
                    required 
                    placeholder="+91 98765 43210"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</Label>
                <Input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required 
                  placeholder="anjali@example.com"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password *</Label>
                  <Input 
                    type="password" 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    required 
                    placeholder="Min. 6 chars"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password *</Label>
                  <Input 
                    type="password" 
                    value={form.confirmPassword} 
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                    required 
                    placeholder="Repeat password"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.profileSharingConsent}
                    onChange={(e) => setForm({ ...form, profileSharingConsent: e.target.checked })}
                    required
                    className="mt-0.5 rounded text-[#1BCFB4] focus:ring-[#1BCFB4]"
                  />
                  <span>I agree to share my candidate profile with verified schools on HireHub.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.contactConsent}
                    onChange={(e) => setForm({ ...form, contactConsent: e.target.checked })}
                    required
                    className="mt-0.5 rounded text-[#1BCFB4] focus:ring-[#1BCFB4]"
                  />
                  <span>I agree to receive job notifications and interview invitations.</span>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-[#1BCFB4] hover:bg-[#16B59D] text-white font-bold rounded-xl shadow-md text-xs mt-2" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Free Registration'}
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
              Already have an applicant account?{' '}
              <Link to="/applicant/login" className="text-[#1BCFB4] font-bold hover:underline">
                Sign in here
              </Link>
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
