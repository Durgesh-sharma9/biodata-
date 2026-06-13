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
import { Database, ArrowRight, Sparkles, Lock, Mail, Eye, EyeOff, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid institutional email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function getPostLoginRoute(role) {
  if (role === 'super_admin') return '/admin/dashboard';
  if (role === 'self_applicant') return '/applicant/profile';
  return '/dashboard';
}

export default function Login({ redirectTo, signupLink = '/signup', title = 'Sign In' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setError('');
      const result = await login(data.email, data.password);
      navigate(redirectTo || getPostLoginRoute(result.user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden antialiased flex flex-col justify-between relative">
      
      {/* VIBRANT BACKGROUND BACKDROP BLURS */}
      <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* GLASSMORPHISM NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full h-20 border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-xl transition-all shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                EduBase<span className="text-indigo-400">.</span>
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60">
              {[
                { label: 'Features', target: '/#features' },
                { label: 'Process', target: '/#how-it-works' },
                { label: 'Pricing', target: '/#pricing' },
                { label: 'Contact', target: '/#contact' }
              ].map((item) => (
                <Link 
                  key={item.label}
                  to={item.target}
                  className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Action */}
            <div className="flex items-center space-x-4">
              <Link to="/signup">
                <Button className="h-9 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-xs px-5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 border border-indigo-400/20 group/btn">
                  <span className="relative z-10 flex items-center gap-1.5">
                    Start Free Trial <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN AUTHENTICATION CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 pt-36 pb-20 relative z-10">
        <div className="w-full max-w-md relative">
          
          {/* Subtle Backglow behind card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

          <Card className="border border-slate-800 bg-slate-950/70 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-md overflow-hidden relative group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <CardHeader className="text-center pt-8 pb-4">
              <div className="inline-flex items-center gap-1.5 self-center px-3 py-1 mb-3 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-[10px] font-bold tracking-wider uppercase text-indigo-300 shadow-inner">
                <Sparkles className="w-3 h-3 text-indigo-400 fill-indigo-400/20" /> Secure Cloud Vault
              </div>
              <CardTitle className="text-3xl font-black tracking-tight text-white">{title}</CardTitle>
              <CardDescription className="text-slate-400 font-medium text-xs mt-1.5">Access your operational school node</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Error Banner Overhaul */}
                {error && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                    <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Institutional Email</Label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@school.edu" 
                      className="pl-11 bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white rounded-xl h-11 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all placeholder:text-slate-600 font-medium"
                      {...register('email')} 
                    />
                  </div>
                  {errors.email && <p className="text-xs font-semibold text-rose-400 pl-1">{errors.email.message}</p>}
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Secure Password</Label>
                    <span className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Forgot credentials?</span>
                  </div>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-11 pr-11 bg-slate-900/40 border-slate-800 hover:border-slate-700 text-white rounded-xl h-11 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all placeholder:text-slate-600 font-medium"
                      {...register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs font-semibold text-rose-400 pl-1">{errors.password.message}</p>}
                </div>
                
                {/* Submit Trigger with Loading State Overhaul */}
                <Button 
                  type="submit" 
                  className="w-full h-11 mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 hover:opacity-95 transition-all transform active:scale-[0.99] hover:-translate-y-0.5 tracking-wide flex items-center justify-center gap-2 border border-indigo-400/10" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Node...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In To Dashboard</span>
                      <KeyRound className="w-3.5 h-3.5 opacity-60" />
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-8 pt-5 border-t border-slate-900 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> FERPA Compliant Tunnel
              </div>

              <p className="mt-6 text-center text-xs text-slate-400 font-medium">
                Don't have an asset space account?{' '}
                <Link to={signupLink} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Start free sandbox trial
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* PREMIUM SOVEREIGN FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 text-[11px] py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-semibold uppercase tracking-wider text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-indigo-400">
              <Database className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-300 font-bold">EduBase Engine Instance</span>
          </div>
          <div className="text-slate-600 font-medium">&copy; 2026 EduBase Technology Inc. All cloud systems secure.</div>
          <div className="flex space-x-6 text-slate-500 font-bold">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Framework</span>
            <span className="hover:text-white cursor-pointer transition-colors">SLA Constants</span>
          </div>
        </div>
      </footer>

    </div>
  );
}