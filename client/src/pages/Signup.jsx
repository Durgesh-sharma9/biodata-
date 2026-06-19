import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Loader2 
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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    mutation.mutate({
      schoolName: formData.schoolName,
      adminName: formData.adminName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f3f4] text-slate-800 font-sans antialiased flex flex-col justify-between relative dark:bg-slate-950 dark:text-slate-200">
      
      {/* FIXED NAVBAR MODULE */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold tracking-tight text-[#A05AFF] hover:opacity-90 transition-opacity">
                BioData Manager
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Link to="/features" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-[#A05AFF] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800">
                Contact
              </Link>
              <span className="h-5 w-px bg-slate-200 mx-2 hidden sm:inline-block dark:bg-slate-800" />
              <Link to="/login">
                <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-[#A05AFF] transition-all px-5 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* REGISTRATION FORM CARD BLOCK CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full relative">
          
          <div className="bg-white p-6 sm:p-8 rounded-xl border-none shadow-sm dark:bg-slate-900">
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Institutional Registry
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Create Your Account</h1>
              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Start your 30-day premium sandbox trial today</p>
            </div>

            {/* Premium Soft-Tint Destructive Alert Banner */}
            {error && (
              <div className="border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] rounded-xl p-4 text-xs font-semibold flex items-start gap-2.5 mb-5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Structural Grid Layout Constraint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="schoolName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    School Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                      placeholder="Enter school name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="adminName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Admin Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="adminName"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                    placeholder="school@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="mobile" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Password Credentials Layout Grid Constraint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Action Node Trigger bound to Violet Code palette */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 text-white/80" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#A05AFF] hover:underline font-bold transition-colors">
                Login here
              </Link>
            </p>

            {/* Success Micro-Badge Element Wrapper */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1BCFB4] dark:border-slate-800">
              <ShieldCheck className="w-4 h-4" /> Compliance Secure Node Environment
            </div>
          </div>
        </div>
      </main>

      {/* MODERN FLAT CANVAS FOOTER LAYOUT */}
      <footer className="bg-white border-t border-slate-100 text-slate-400 py-6 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <p>&copy; 2026 BioData Manager. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-[#A05AFF] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#A05AFF] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}