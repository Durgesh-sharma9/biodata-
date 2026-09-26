import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { GoogleLoginButton } from '@/components/common/GoogleLoginButton';
import { 
  Briefcase,
  Building2, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  GraduationCap,
  ArrowLeft
} from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    adminName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [googleData, setGoogleData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoogleSuccess = (res) => {
    if (res?.user?.schoolId || res?.user?.role === 'school_admin') {
      navigate('/dashboard');
      window.location.reload();
      return;
    }

    if (res?.user?.email) {
      setGoogleData({
        email: res.user.email,
        name: res.user.name,
        avatarUrl: res.user.avatarUrl,
        googleId: res.user.googleId,
      });
      setFormData((prev) => ({
        ...prev,
        email: res.user.email || prev.email,
        adminName: res.user.name || prev.adminName,
      }));
    }
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed');
      return result;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!googleData && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!googleData && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    mutation.mutate({
      schoolName: formData.schoolName,
      adminName: formData.adminName,
      email: formData.email,
      mobile: formData.mobile,
      password: googleData ? undefined : formData.password,
      googleId: googleData?.googleId,
      avatarUrl: googleData?.avatarUrl,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans antialiased flex flex-col justify-between dark:bg-slate-950 dark:text-slate-200">
      
      {/* NAVBAR */}
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
            <Link to="/join">
              <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-[#1BCFB4] dark:text-slate-300">
                <GraduationCap className="w-4 h-4 mr-1 text-[#1BCFB4]" /> Candidate Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="h-9 rounded-xl border-slate-300 text-slate-700 font-bold text-xs px-4">
                School Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* SIGNUP FORM */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Colorful Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#A05AFF]/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#1BCFB4]/20 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-[#FE7096]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

        <div className="max-w-xl w-full relative z-10">
          
          {/* Back button above card */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#A05AFF] hover:border-[#A05AFF]/50 text-xs font-bold shadow-xs transition-all group backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#A05AFF]" />
              <span>Back</span>
            </button>
            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-[#A05AFF] transition-colors">
              Back to Home
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl dark:bg-slate-900/95 dark:border-slate-800">
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full border border-[#A05AFF]/30 bg-gradient-to-r from-[#A05AFF]/15 via-[#FE7096]/10 to-[#1BCFB4]/15 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> School Registration
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Register Your School on HireHub
              </h1>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Start your 14-day free trial. Includes your custom QR code &amp; talent pool access.
              </p>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 text-red-600 rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5 mb-5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="schoolName" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    School / Institute Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                      placeholder="e.g. Greenwood Public School"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="adminName" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Admin / Principal Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="adminName"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                      placeholder="e.g. Dr. Rajesh Verma"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  School Official Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                    placeholder="admin@greenwood.edu.in"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mobile" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mobile / Contact Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {!googleData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                        placeholder="Min. 6 chars"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A05AFF] dark:bg-slate-950 dark:border-slate-800"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-11 rounded-xl bg-[#A05AFF] hover:bg-[#8B3DFF] text-white font-bold text-sm shadow-md shadow-[#A05AFF]/25 transition-all mt-3"
              >
                {mutation.isPending ? 'Registering School...' : 'Create School Account'}
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                <span className="bg-white dark:bg-slate-900 px-3">Or register with</span>
              </div>
            </div>

            <GoogleLoginButton
              buttonText="Sign up with Google"
              onSuccess={handleGoogleSuccess}
              targetRole="school_admin"
            />

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs dark:border-slate-800">
              <p className="text-slate-500 font-medium">
                Already registered your school?{' '}
                <Link to="/login" className="text-[#A05AFF] hover:underline font-bold">
                  Sign in here
                </Link>
              </p>
              <p className="text-slate-500 font-medium">
                Are you a Teacher or Job Seeker?{' '}
                <Link to="/join" className="text-[#1BCFB4] hover:underline font-bold">
                  Apply as a Candidate for Free
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-5 dark:bg-slate-900 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} HireHub Technologies. All rights reserved.
      </footer>

    </div>
  );
}