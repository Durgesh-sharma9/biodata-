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
  BadgeCheck,
  Sparkles,
  Users,
  QrCode
} from 'lucide-react';

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

  // Password rules validation from reference image
  const hasMinLength = formData.password.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(formData.password);
  const hasMixedCase = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans antialiased text-slate-800">
      
      {/* 1. Signature Homepage Floating Bubble Orbs */}
      <FloatingBubbles />

      {/* 2. Soft Ambient Radial Glows */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3. Main SaaS Dual-Card Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT PANEL: RICH HIREHUB RECRUITMENT OS HERO SHOWCASE
            (Navy + Teal + Glassmorphism Cards)
            - Only visible on Desktop (lg:), keeping mobile ultra-clean
        ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-8 xl:p-12 rounded-3xl bg-gradient-to-br from-[#08295C] via-[#0E2A5E] to-[#1E1B4B] text-white shadow-2xl border border-white/10 relative overflow-hidden min-h-[660px]">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#12B9A5]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl pointer-events-none" />

          {/* Top Header: Brand Logo & Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/hirehub-brand-icon.png?v=5"
                alt="HireHub Logo"
                className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-tight font-sans tracking-tight">
                  Hire<span className="text-[#12B9A5]">Hub</span>
                </span>
                <span className="text-[10px] font-bold text-violet-200 uppercase tracking-wider">
                  School Staff Recruitment OS
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>150+ Schools Active</span>
            </span>
          </div>

          {/* Middle Body */}
          <div className="relative z-10 my-auto py-8 space-y-6">
            <div className="space-y-2.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12B9A5]/20 text-[#12B9A5] text-xs font-bold border border-[#12B9A5]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Setup Fees • Instant Activation</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
                Create Your School's Digital Recruitment Portal.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Set up your custom application link, generate your reception standee QR code, and organize walk-in applicants into an instant digital database.
              </p>
            </div>

            {/* Interactive Live Proof Showcase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg space-y-2 transition-all hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Direct Candidate Vault
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-2xl font-black text-white">Full Privacy</div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Candidates who apply to your link belong exclusively to your school.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg space-y-2 transition-all hover:bg-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#12B9A5] flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5" /> Gate QR Standee
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Ready in 2 Mins
                  </span>
                </div>
                <div className="text-2xl font-black text-white">Zero Paper</div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Walk-in teachers scan your QR code at gate and submit biodata in 2 minutes.
                </p>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> Free 90-Day Access
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> No Credit Card Required
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" /> Dedicated School Admin Portal
              </span>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>&copy; {new Date().getFullYear()} HireHub OS &bull; All rights reserved</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT PANEL: SIGN UP FORM CARD (Clean, Modern & Responsive)
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 xl:col-span-5 w-full max-w-lg mx-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 xl:p-9 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          
          {/* Top Bar: Circular Back Button & Already Member Link */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer bg-white hover:bg-slate-50 shadow-xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-xs sm:text-[13px] font-medium text-slate-400">
              Already member?{' '}
              <Link to="/login" className="text-[#4E66F8] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Mobile-Only Header Brand Bar */}
          <div className="lg:hidden flex items-center gap-3 pt-1 pb-3 mb-3 border-b border-slate-100">
            <img 
              src="/hirehub-brand-icon.png?v=5" 
              alt="HireHub Logo" 
              className="w-9 h-9 object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 leading-tight font-sans">
                Hire<span className="text-[#12B9A5]">Hub</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                School Staff Recruitment OS
              </span>
            </div>
          </div>

          {/* Header Title based on Step */}
          <div className="mb-4">
            {step === 1 ? (
              <>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  Sign Up
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-400 font-medium mt-1">
                  Direct Faculty &amp; Staff Recruitment for Schools
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  Verify School Email
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
                  Enter 6-digit OTP sent to <span className="font-semibold text-slate-800">{formData.email}</span>
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-600 border border-rose-200 p-2.5 text-xs font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Registration Details Form */
            <form onSubmit={handleInitiateSignup} className="space-y-3">
              
              {/* School / Institute Name Field */}
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <Building2 className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    placeholder="School / Institute Name"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {isNameValid && (
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Email Underline Field */}
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Official School Email"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {isEmailValid && (
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Number Underline Field */}
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <Phone className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="Contact Number (+91)"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {!googleData && (
                <>
                  {/* Password Underline Field */}
                  <div className="space-y-1">
                    <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                      <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create Password"
                        className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Checklist */}
                    <div className="pt-1 space-y-0.5 text-[11px] font-medium text-slate-400">
                      <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3 h-3" />
                        <span>Least 6 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3 h-3" />
                        <span>Least one number (0-9) or symbol</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasMixedCase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3 h-3" />
                        <span>Lowercase (a-z) and uppercase (A-Z)</span>
                      </div>
                    </div>
                  </div>

                  {/* Re-type Password Underline Field */}
                  <div className="space-y-1">
                    <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                      <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-Type Password"
                        className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-2"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit & Social Auth */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={otpLoading || mutation.isPending}
                  className="w-full h-11 rounded-full bg-[#4E66F8] hover:bg-[#3D56EC] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#4E66F8]/25 hover:shadow-[#4E66F8]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {otpLoading ? (
                    <span>Sending Verification Code...</span>
                  ) : mutation.isPending ? (
                    <span>Creating School Account...</span>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-slate-200"></div>
                  <span className="absolute bg-white px-3 text-xs text-slate-400 font-medium">Or</span>
                </div>

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
              
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <KeyRound className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-transparent text-lg font-bold tracking-widest text-slate-800 placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Code valid for 10 minutes</span>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="text-[#4E66F8] font-semibold hover:underline cursor-pointer"
                  >
                    Change Details
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={mutation.isPending || otp.length < 6}
                  className="w-full h-11 rounded-full bg-[#4E66F8] hover:bg-[#3D56EC] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#4E66F8]/25 hover:shadow-[#4E66F8]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {mutation.isPending ? (
                    <span>Verifying &amp; Creating School...</span>
                  ) : (
                    <>
                      <span>Verify &amp; Create School</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResendSignupOtp}
                    disabled={resendTimer > 0 || otpLoading}
                    className="text-[#4E66F8] font-semibold hover:underline disabled:opacity-50 disabled:hover:no-underline cursor-pointer"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : (otpLoading ? 'Sending...' : 'Resend Code')}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>

  </div>
);
}