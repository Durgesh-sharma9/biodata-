import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GoogleSignupButton } from '@/components/common/GoogleSignupButton';
import { registerSchool, sendSignupOtp } from '@/lib/api';
import FloatingBubbles from '@/components/common/FloatingBubbles';
import { 
  Building2, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  GraduationCap, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Users,
  QrCode,
  Loader2,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Details, 2 = Verify Email OTP
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setError('');
      return;
    }
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Called by GoogleSignupButton — no backend call, just profile pre-fill
  const handleGoogleProfile = (profile) => {
    setGoogleData({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      googleId: profile.googleId,
      credential: profile.credential,
    });
    setFormData((prev) => ({
      ...prev,
      email: profile.email || prev.email,
      adminName: profile.name || prev.adminName,
    }));
    setError('');
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await registerSchool(data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      window.location.reload();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
    },
  });

  // Step 1: Submit details -> Send Email OTP
  const handleInitiateSignup = async (e) => {
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

    // If signed up via Google, register directly (no OTP needed)
    if (googleData) {
      mutation.mutate({
        ...formData,
        adminName: formData.adminName || (formData.schoolName ? `${formData.schoolName} Admin` : 'School Admin'),
        googleId: googleData.googleId,
        googleCredential: googleData.credential, // for backend JWT verification
        avatarUrl: googleData.avatarUrl,
      });
      return;
    }

    // Standard email registration: Send OTP first
    try {
      setOtpLoading(true);
      setError('');
      await sendSignupOtp({
        email: formData.email,
        schoolName: formData.schoolName,
      });
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtpAndRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length < 6) {
      setError('Please enter the 6-digit verification code sent to your email');
      return;
    }

    mutation.mutate({
      ...formData,
      adminName: formData.adminName || (formData.schoolName ? `${formData.schoolName} Admin` : 'School Admin'),
      otp: otp.trim(),
    });
  };

  const handleResendSignupOtp = async () => {
    if (resendTimer > 0 || otpLoading) return;
    try {
      setOtpLoading(true);
      setError('');
      await sendSignupOtp({
        email: formData.email,
        schoolName: formData.schoolName,
      });
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const isEmailValid = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isNameValid = formData.schoolName && formData.schoolName.length > 2;

  // Password rules validation
  const hasMinLength = formData.password.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(formData.password);
  const hasMixedCase = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-800 font-sans antialiased selection:bg-violet-600 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. Signature Homepage Floating Bubble Orbs */}
      <FloatingBubbles />

      {/* 2. Soft Ambient Radial Glows (Exact Homepage Palette) */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ─────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR (Exact Landing Page Header Experience)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group py-1">
            <img
              src="/hirehub-brand-icon.png?v=5"
              alt="HireHub Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#08295C] font-sans leading-tight">
                Hire<span className="text-[#12B9A5]">Hub</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-wider uppercase -mt-0.5">
                School Staff Recruitment OS
              </span>
            </div>
          </Link>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-slate-500 font-medium">Already registered?</span>
              <Link to="/login">
                <Button variant="outline" className="h-9 sm:h-10 px-3.5 sm:px-5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-violet-700 hover:border-violet-300 text-xs font-bold shadow-2xs transition-all">
                  School Login
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (Luminous Landing Theme Showcase + Form)
      ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ─────────────────────────────────────────────────────────
              LEFT COLUMN: LANDING PAGE HERO SHOWCASE (Desktop)
              - Luminous, airy, friendly, exact same as Homepage!
          ───────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-200 bg-white/90 shadow-2xs backdrop-blur-md self-start">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-700">
                Register Your School Free • Instant Setup
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-[#08295C] leading-[1.15]">
                Set Up Your School's{' '}
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Recruitment Portal
                </span>
              </h1>
              <p className="text-base text-slate-600 max-w-xl leading-relaxed font-normal">
                Generate your custom application link, download your gate QR standee in 2 minutes, and organize walk-in applicants into your private candidate vault.
              </p>
            </div>

            {/* Mascot / Hero Illustration with Floating Badges (From Landing.jsx) */}
            <div className="relative w-full max-w-[420px] flex items-center justify-center py-6">
              
              {/* Soft ambient colorful blur */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-indigo-500/15 to-teal-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

              <div className="relative w-full flex items-center justify-center group">
                <img 
                  src="/hirehub-hiring-illustration.png" 
                  alt="We Are Hiring School Staff" 
                  className="w-full max-w-[320px] xl:max-w-[360px] h-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Pill Badge 1: Direct Vault */}
                <div className="absolute top-2 -left-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2.5 animate-float-slow hover:border-violet-300 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight">Direct School Vault</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">100% Private &amp; Secure</div>
                  </div>
                </div>

                {/* Floating Pill Badge 2: Gate QR Intake */}
                <div className="absolute -bottom-2 -right-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-violet-500/10 hover:border-violet-300 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight">Gate QR Standee</div>
                    <div className="text-[10px] text-violet-600 font-semibold">Ready in 2 Minutes</div>
                  </div>
                </div>

                {/* Floating Pill Badge 3: 150+ Schools (top right) */}
                <div className="absolute top-8 -right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-slate-700 font-bold text-[11px] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Zero Agency Fees</span>
                </div>
              </div>

            </div>

            {/* Trust Badges Strip (matching landing page) */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Free School Registration
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> No Credit Card Required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated Admin Dashboard
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────
              RIGHT COLUMN: SIGN UP CARD (Mobile & Desktop)
              - Crisp, elevated, landing page card design
          ───────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            
            {/* The Elevated White Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_15px_45px_-10px_rgba(8,41,92,0.08)] relative space-y-5">
              
              {/* Card Top: Back button & switch */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back</span>
                  </button>

                  <div className="text-xs font-medium text-slate-500">
                    Already member?{' '}
                    <Link to="/login" className="text-violet-600 font-bold hover:underline">
                      Sign in
                    </Link>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#08295C] tracking-tight">
                    {step === 1 ? 'Register School' : 'Verify School Email'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {step === 1 
                      ? 'Create your free school hiring portal' 
                      : `Enter 6-digit code sent to ${formData.email}`}
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 ? (
                /* STEP 1: Registration Details Form */
                <form onSubmit={handleInitiateSignup} className="space-y-3.5 sm:space-y-4">
                  
                  {/* School / Institute Name Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      School / Institute Name
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
                        placeholder="e.g. St. Xavier's International School"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                      />
                      {isNameValid && (
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Official School Email
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
                        placeholder="e.g. principal@school.edu.in"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                      />
                      {isEmailValid && (
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Number Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Contact Number (+91)
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
                        placeholder="Mobile or Principal Office Number"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {!googleData && (
                    <>
                      {/* Password Field */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Create Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Min 6 characters"
                            className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Password rules indicator */}
                        <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-slate-400">
                          <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-semibold' : ''}`}>
                            <Check className="w-3 h-3" /> 6+ chars
                          </span>
                          <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-emerald-600 font-semibold' : ''}`}>
                            <Check className="w-3 h-3" /> Number/Symbol
                          </span>
                          <span className={`flex items-center gap-1 ${hasMixedCase ? 'text-emerald-600 font-semibold' : ''}`}>
                            <Check className="w-3 h-3" /> a-z &amp; A-Z
                          </span>
                        </div>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-type password"
                            className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      disabled={otpLoading || mutation.isPending}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Verification Code...</span>
                        </>
                      ) : mutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating School Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign Up</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center py-1">
                      <div className="w-full border-t border-slate-200" />
                      <span className="absolute bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        Or
                      </span>
                    </div>

                    {/* Google Signup */}
                    <div className="flex justify-center w-full">
                      <GoogleSignupButton
                        text="signup_with"
                        onGoogleProfile={handleGoogleProfile}
                      />
                    </div>
                  </div>

                </form>
              ) : (
                /* STEP 2: Email OTP Verification Form */
                <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enter 6-Digit Email Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        maxLength={6}
                        placeholder="••••••"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-black tracking-widest text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-3 focus:ring-violet-500/15 focus:border-violet-600 transition-all text-center"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Code valid for 10 minutes</span>
                      <button
                        type="button"
                        onClick={() => { setStep(1); setError(''); }}
                        className="text-violet-600 font-semibold hover:underline cursor-pointer"
                      >
                        Change Details
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      disabled={mutation.isPending || otp.length < 6}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying &amp; Creating School...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Create School</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Didn't receive the code?</span>
                      <button
                        type="button"
                        onClick={handleResendSignupOtp}
                        disabled={resendTimer > 0 || otpLoading}
                        className="text-violet-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : (otpLoading ? 'Sending...' : 'Resend Code')}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Bottom Security Note */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted &bull; Direct School Privacy</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          PAGE FOOTER (Subtle & Clean)
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <div>
            &copy; {new Date().getFullYear()} HireHub OS &bull; Direct School Faculty &amp; Staff Recruitment
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}