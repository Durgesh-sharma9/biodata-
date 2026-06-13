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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-800 font-sans antialiased flex flex-col justify-between relative selection:bg-indigo-500/10">
      
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* FIXED STICKY NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                BioData Manager
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Link to="/features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                Pricing
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                Contact
              </Link>
              <span className="h-5 w-px bg-slate-200/80 mx-2 hidden sm:inline-block" />
              <Link to="/login">
                <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-indigo-600 transition-all px-5">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* REGISTRATION FORM MODULE */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-xl w-full relative">
          
          {/* Subtle backglow template overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3 fill-indigo-500/20" /> Institutional Registry
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Create Your Account</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">Start your 30-day premium sandbox trial today</p>
            </div>

            {/* Premium Dynamic Alert Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs font-semibold text-rose-600 flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Grid split for core parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="schoolName" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    School Name *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
                      placeholder="Enter school name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="adminName" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Admin Name *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="adminName"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
                    placeholder="school@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="mobile" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mobile Number *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Password credentials layout split column row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Password *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
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
                      className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
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
                      className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Action Trigger with Integrated Spinner State */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 group/btn"
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
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm font-semibold text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                Login here
              </Link>
            </p>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> Compliance Secure Node Environment
            </div>
          </div>
        </div>
      </main>

      {/* PREMIUM HIGH-CONTRAST FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs md:text-sm font-medium">&copy; 2026 BioData Manager. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}