import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GoogleLoginButton } from '@/components/common/GoogleLoginButton';
import { registerSchool, sendSignupOtp } from '@/lib/api';
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
  BadgeCheck
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

    // If signed up via Google, register directly
    if (googleData) {
      mutation.mutate({
        ...formData,
        adminName: formData.adminName || (formData.schoolName ? `${formData.schoolName} Admin` : 'School Admin'),
        googleId: googleData.googleId,
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
    <div className="min-h-screen lg:h-screen w-full flex flex-col md:flex-row bg-[#AFC6FF] font-sans selection:bg-[#4E66F8] selection:text-white overflow-x-hidden lg:overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: FULL-HEIGHT RICH HIREHUB RECRUITMENT SHOWCASE
          (Seamless organic contour: 100% continuous SVG, ZERO notches/steps)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[44%] xl:w-[42%] min-h-screen lg:h-screen relative flex-col justify-between p-6 lg:p-10 select-none shrink-0 overflow-visible">
        
        {/* Unified Continuous SVG Background */}
        <div className="absolute inset-0 -right-14 h-full w-[calc(100%+56px)] pointer-events-none z-0 overflow-visible">
          <svg className="w-full h-full" viewBox="0 0 500 1000" fill="none" preserveAspectRatio="none">
            {/* 1. Base Cobalt Blue Body with smooth inward slope and elegant flared bottom */}
            <path 
              d="M 0,0 
                 L 430,0 
                 L 430,195 
                 C 425,360 405,500 390,640 
                 C 380,750 405,880 455,965 
                 C 468,985 475,1000 475,1000 
                 L 0,1000 Z" 
              fill="#3160E8" 
            />

            {/* 2. Bottom Radiant Sky-Blue Wave (Shares identical right boundary curve) */}
            <path 
              d="M 0,580 
                 C 130,530 260,600 390,640 
                 C 380,750 405,880 455,965 
                 C 468,985 475,1000 475,1000 
                 L 0,1000 Z" 
              fill="#4D8BF8" 
            />

            {/* 3. Subtle Mid-Tone Wave Overlay for aesthetic depth */}
            <path 
              d="M 0,380 
                 C 140,320 280,410 400,450 
                 L 395,490 
                 C 260,450 130,370 0,420 Z" 
              fill="#3868EA" 
              opacity="0.35" 
            />

            {/* 4. Top Dark Royal Ribbon & Banner (Deeper so logo & badges are 100% inside dark section) */}
            <path 
              d="M 0,0 
                 L 475,0 
                 C 488,0 495,8 495,20 
                 L 495,140 
                 C 495,175 470,195 435,195 
                 L 430,195 
                 C 350,200 240,175 140,185 
                 C 70,192 25,180 0,182 
                 L 0,0 Z" 
              fill="#20337E" 
            />

            {/* 5. Tucked Ribbon Under-fold Shadow */}
            <path 
              d="M 405,195 
                 L 430,195 
                 L 430,215 Z" 
              fill="#141E4E" 
            />
          </svg>
        </div>

        {/* Top Header inside showcase: HireHub Logo & OS Brand */}
        <div className="relative z-10 flex items-center justify-between pt-1 sm:pt-2">
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/hirehub-logo-transparent.png" 
              alt="HireHub Logo" 
              className="h-8 w-auto object-contain drop-shadow-md" 
            />
            <div className="flex flex-col">
              <span className="text-lg font-black text-white leading-none">
                HireHub
              </span>
              <span className="text-[9px] font-bold text-violet-200 uppercase tracking-wider mt-0.5">
                School Staff Recruitment OS
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
            <Building2 className="w-3.5 h-3.5 text-amber-300" /> 150+ Schools
          </span>
        </div>

        {/* Floating UI Elements Container (Rich Landing Page Data - Centered with Gentle Floating Motion) */}
        <div className="relative z-10 w-full max-w-[320px] mx-auto flex flex-col items-center justify-center gap-5 my-auto py-4">
          
          {/* FLOATING CARD 1: HIREHUB VERIFIED TEACHER POOL */}
          <div className="relative w-[280px] animate-float-card-primary">
            <div className="w-[230px] bg-white rounded-3xl p-5 shadow-2xl shadow-blue-950/25 transition-transform hover:scale-[1.02] duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Verified Teachers
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Pool
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                2,480+
              </div>
              
              {/* Wavy line chart with verified rate circular badge */}
              <div className="relative h-11 flex items-center">
                <svg className="w-full h-9 overflow-visible" viewBox="0 0 160 40" fill="none">
                  <path 
                    d="M 5 24 Q 25 2, 45 28 T 85 15 T 125 30 T 155 18" 
                    stroke="#F97316" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 45 28 Q 65 38, 85 15 T 115 26" 
                    stroke="#4E66F8" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeLinecap="round" 
                  />
                </svg>
                
                {/* Black circle tag with '98%' */}
                <div className="absolute left-[45%] top-[12px] -translate-x-1/2 -translate-y-1/2 px-1.5 h-6 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  98%
                </div>
              </div>

              {/* Mini Candidate Profile Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="truncate">👩‍🏫 Priya S. • PGT Math</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="truncate">👨‍🏫 Rajesh V. • TGT Science</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                </div>
              </div>
            </div>

            {/* Floating Teacher / Education Badge */}
            <div className="absolute right-0 top-1 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform animate-float-badge-cap">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Floating School Portal Badge */}
            <div className="absolute right-2 top-20 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform animate-float-badge-school">
              <Building2 className="w-5 h-5 text-[#3662E3]" />
            </div>
          </div>

          {/* HIREHUB SPEED & VALUE PILLS */}
          <div className="flex items-center justify-center gap-2 w-full max-w-[280px] animate-float-pills">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25">
              <Zap className="w-3 h-3 text-amber-300" /> 3x Faster Hiring
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25">
              <ShieldCheck className="w-3 h-3 text-emerald-300" /> 0% Agency Fees
            </span>
          </div>

          {/* FLOATING CARD 2: DIRECT RECRUITMENT & VERIFICATION */}
          <div className="w-[280px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-blue-950/20 flex gap-3.5 items-center animate-float-card-secondary transition-transform hover:scale-[1.02] duration-300">
            
            {/* Left stacked minimal category lines */}
            <div className="space-y-1.5 shrink-0 w-10">
              <div className="h-2 w-8 bg-[#4E66F8] rounded-full" />
              <div className="h-1.5 w-10 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-6 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-8 bg-slate-100 rounded-full" />
            </div>

            {/* Right: Orange Key Icon & HireHub Direct Hiring Text */}
            <div className="flex-1 min-w-0">
              <div className="w-6 h-6 text-amber-500 mb-1 flex items-center justify-start">
                <KeyRound className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Direct School Hiring
              </h4>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Zero agency commission. 100% verified candidate credentials.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Feature Footer inside showcase */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-violet-100 font-medium">
          <span>&copy; 2025 HireHub &bull; All rights reserved</span>
          <span className="flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Systems Online
          </span>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: SIGN UP BOX SITTING IN THE PERIWINKLE CANVAS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen lg:h-screen flex items-center justify-center p-4 sm:p-6 lg:p-6 lg:py-4 relative z-10">
        
        {/* The White Card / Box */}
        <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl shadow-blue-950/15 p-6 sm:p-8 lg:py-6 lg:px-8 relative z-10 border border-white/80">
          
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
                  <GoogleLoginButton
                    buttonText="Sign up with Google"
                    onSuccess={handleGoogleSuccess}
                    targetRole="school_admin"
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
  );
}