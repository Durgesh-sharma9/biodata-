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
    <div className="min-h-screen bg-[#f3f3f4] text-slate-800 font-sans antialiased flex flex-col justify-between relative dark:bg-slate-950 dark:text-slate-200">
      
      {/* FIXED NAVBAR MODULE */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full h-20 border-b border-slate-100 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <span className="text-xl font-bold tracking-tight text-[#A05AFF]">
                EduBase
              </span>
            </Link>
            
            {/* Navigation links */}
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
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[#A05AFF] rounded-xl hover:bg-slate-50 transition-all dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Action Trigger */}
            <div className="flex items-center space-x-4">
              <Link to="/signup">
                <Button className="h-10 rounded-xl bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-semibold shadow-sm px-5 transition-all">
                  Start Free Trial <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN AUTHENTICATION CARD BLOCK CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md relative">
          
          <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
            <CardHeader className="text-center p-6 pb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] text-[11px] font-bold uppercase tracking-wider mb-2 self-center">
                <Sparkles className="w-3 h-3" /> Secure Cloud Vault
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{title}</CardTitle>
              <CardDescription className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-1">Access your operational school node</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {error && (
                  <div className="rounded-xl border border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] p-4 text-xs font-bold flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE9496] mt-1.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {/* Email Input Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Institutional Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@school.edu" 
                      className="w-full h-11 pl-11 px-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                      {...register('email')} 
                    />
                  </div>
                  {errors.email && <p className="text-xs font-bold text-[#FE9496] pl-1">{errors.email.message}</p>}
                </div>
                
                {/* Password Input Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Secure Password</Label>
                    <span className="text-[11px] font-bold text-[#A05AFF] hover:underline cursor-pointer transition-colors">Forgot credentials?</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full h-11 pl-11 pr-11 px-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-950 dark:border-slate-800"
                      {...register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs font-bold text-[#FE9496] pl-1">{errors.password.message}</p>}
                </div>
                
                {/* Submit Trigger Action node */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl shadow-sm transition-all text-sm mt-2" 
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
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1BCFB4] dark:border-slate-800">
                <ShieldCheck className="w-4 h-4" /> FERPA Compliant Tunnel
              </div>

              <p className="mt-5 text-center text-xs text-slate-500 font-semibold dark:text-slate-400">
                Don't have an asset space account?{' '}
                <Link to={signupLink} className="text-[#A05AFF] hover:underline font-bold transition-colors">
                  Start free sandbox trial
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* MODERN FLAT CANVAS FOOTER LAYOUT */}
      <footer className="bg-white border-t border-slate-100 py-6 dark:bg-slate-900 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-bold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-800 dark:text-slate-200 font-bold">EduBase Engine Instance</span>
          </div>
          <div>&copy; 2026 EduBase Technology Inc. All cloud systems secure.</div>
          <div className="flex space-x-6">
            <span className="hover:text-[#A05AFF] cursor-pointer transition-colors">Privacy Framework</span>
            <span className="hover:text-[#A05AFF] cursor-pointer transition-colors">SLA Constants</span>
          </div>
        </div>
      </footer>

    </div>
  );
}