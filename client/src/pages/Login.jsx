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
import { Database, ArrowRight, Sparkles, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid institutional email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
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
      navigate(result.user.role === 'super_admin' ? '/admin/schools' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden antialiased flex flex-col justify-between relative">
      
      {/* VIBRANT BACKGROUND BACKDROP BLURS */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-300/20 via-cyan-200/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-purple-300/20 via-pink-200/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* FIXED GLASSMORPHISM NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full h-20 border-b border-white/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-[0_4px_30px_-10px_rgba(99,102,241,0.05)]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-300">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent">
                EduBase<span className="text-pink-500">.</span>
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Features', target: '/#features' },
                { label: 'Process', target: '/#how-it-works' },
                { label: 'Pricing', target: '/#pricing' },
                { label: 'Contact', target: '/#contact' }
              ].map((item) => (
                <Link 
                  key={item.label}
                  to={item.target}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/70 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Action */}
            <div className="flex items-center space-x-4">
              <Link to="/signup">
                <Button className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="relative z-10 flex items-center gap-1.5">
                    Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

          <Card className="border border-white bg-white/80 rounded-3xl shadow-[0_20px_50px_rgba(99,102,241,0.08)] ring-1 ring-slate-100 backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <CardHeader className="text-center pt-8 pb-4">
              <div className="inline-flex items-center gap-1.5 self-center px-3 py-1 mb-3 rounded-full border border-indigo-100 bg-indigo-50/60 text-[10px] font-black tracking-wider uppercase text-indigo-700 shadow-sm">
                <Sparkles className="w-3 h-3 text-indigo-500 fill-indigo-500" /> Secure Cloud Vault
              </div>
              <CardTitle className="text-3xl font-black tracking-tight text-slate-900">Sign In</CardTitle>
              <CardDescription className="text-slate-500 font-medium text-sm mt-1">Access your operational school node</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {error && (
                  <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-xs font-bold text-rose-600 shadow-inner flex items-start gap-2.5 animate-headShake">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700 tracking-wide uppercase">Institutional Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@school.edu" 
                      className="pl-11 bg-slate-50/50 border-slate-200 rounded-xl h-12 text-slate-900 placeholder-slate-400 font-medium text-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all shadow-inner"
                      {...register('email')} 
                    />
                  </div>
                  {errors.email && <p className="text-xs font-bold text-rose-500 pl-1">{errors.email.message}</p>}
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-700 tracking-wide uppercase">Secure Password</Label>
                    <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">Forgot credentials?</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-11 pr-11 bg-slate-50/50 border-slate-200 rounded-xl h-12 text-slate-900 placeholder-slate-400 font-medium text-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all shadow-inner"
                      {...register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs font-bold text-rose-500 pl-1">{errors.password.message}</p>}
                </div>
                
                {/* Submit Trigger */}
                <Button 
                  type="submit" 
                  className="w-full h-12 mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating Node...
                    </span>
                  ) : 'Sign In To Dashboard'}
                </Button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> FERPA Compliant Tunnel
              </div>

              <p className="mt-6 text-center text-sm text-slate-600 font-semibold">
                Don't have an asset space account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                  Start free sandbox trial
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* PREMIUM HIGH-CONTRAST FOOTER */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-bold text-[11px] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Database className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-900">EduBase Engine Instance</span>
          </div>
          <div>&copy; 2026 EduBase Technology Inc. All cloud systems secure.</div>
          <div className="flex space-x-6 text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy Framework</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">SLA Constants</span>
          </div>
        </div>
      </footer>

    </div>
  );
}