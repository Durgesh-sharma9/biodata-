import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Check, 
  KeyRound,
  GraduationCap,
  Building2,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import { forgotPassword as apiForgotPassword, resetPasswordWithOtp as apiResetPasswordWithOtp } from '@/lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter otp & new pass, 3 = success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      const res = await apiForgotPassword({ email });
      setSuccessMsg(res.data?.message || 'OTP sent successfully to your email');
      setStep(2);
      setResendTimer(60); // 60s cooldown for resend
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 6) {
      setError('Please enter the valid 6-digit OTP code');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await apiResetPasswordWithOtp({
        email,
        otp,
        newPassword,
      });
      setSuccessMsg(res.data?.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    try {
      setLoading(true);
      setError('');
      await apiForgotPassword({ email });
      setSuccessMsg('A new OTP has been sent to your email.');
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setError('');
      setSuccessMsg('');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col md:flex-row bg-[#AFC6FF] font-sans selection:bg-[#4E66F8] selection:text-white overflow-x-hidden lg:overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: FULL-HEIGHT RICH HIREHUB RECRUITMENT SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[44%] xl:w-[42%] min-h-screen lg:h-screen relative flex-col justify-between p-6 lg:p-10 select-none shrink-0 overflow-visible">
        
        {/* Unified Continuous SVG Background */}
        <div className="absolute inset-0 -right-14 h-full w-[calc(100%+56px)] pointer-events-none z-0 overflow-visible">
          <svg className="w-full h-full" viewBox="0 0 500 1000" fill="none" preserveAspectRatio="none">
            {/* 1. Base Cobalt Blue Body */}
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

            {/* 2. Bottom Radiant Sky-Blue Wave */}
            <path 
              d="M 0,580 
                 C 130,530 260,600 390,640 
                 C 380,750 405,880 455,965 
                 C 468,985 475,1000 475,1000 
                 L 0,1000 Z" 
              fill="#4D8BF8" 
            />

            {/* 3. Subtle Mid-Tone Wave Overlay */}
            <path 
              d="M 0,380 
                 C 140,320 280,410 400,450 
                 L 395,490 
                 C 260,450 130,370 0,420 Z" 
              fill="#3868EA" 
              opacity="0.35" 
            />

            {/* 4. Top Dark Royal Ribbon & Banner */}
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
              fill="#182A78" 
            />

            {/* 5. Fluid Highlight Accent Ring */}
            <path 
              d="M 120,186 
                 C 220,180 340,202 430,195" 
              stroke="#688BF8" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              opacity="0.6" 
            />
          </svg>
        </div>

        {/* Top Header inside Dark Ribbon */}
        <div className="relative z-10 flex items-center justify-between pt-1">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">HireHub</span>
              <span className="text-[9px] font-bold text-cyan-300 tracking-wider uppercase block">Account Security</span>
            </div>
          </Link>
          
          <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Center Recruitment Vector Showcase */}
        <div className="relative z-10 my-auto py-6 max-w-[370px]">
          
          {/* Card 1: Verified Teachers Pool */}
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/80 animate-float-card-primary">
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                Teacher Recruitment
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Network
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">2,480+</div>
                <div className="text-[10px] text-slate-500 font-medium">Verified Active Faculty</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">98% Fit</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded-lg border border-slate-100/80">
                <span className="font-semibold text-slate-700 truncate text-[11px]">Priya S. &bull; PGT Math</span>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded-lg border border-slate-100/80">
                <span className="font-semibold text-slate-700 truncate text-[11px]">Rajesh V. &bull; TGT Science</span>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
            </div>

            {/* Floating Badge: Graduation Cap */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white animate-float-badge-cap">
              <GraduationCap className="w-4 h-4" />
            </div>

            {/* Floating Badge: School Building */}
            <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-float-badge-school">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Highlight Pills */}
          <div className="mt-3 flex items-center gap-2 animate-float-pills">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold">
              <Zap className="w-3 h-3 text-amber-300" /> Instant OTP Delivery
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold">
              <Check className="w-3 h-3 text-cyan-300" /> Direct Account Recovery
            </div>
          </div>

          {/* Card 2: Security & Recovery */}
          <div className="mt-3 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/70 flex items-center gap-3 animate-float-card-secondary">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Official Domain Mailer</div>
              <div className="text-[10px] text-slate-500 leading-tight">Delivered directly via mail.webncode.in</div>
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
          RIGHT SIDE: FORGOT PASSWORD CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen lg:h-screen flex items-center justify-center p-4 sm:p-6 lg:p-6 lg:py-4 relative z-10">
        
        {/* The White Card */}
        <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl shadow-blue-950/15 p-6 sm:p-8 lg:py-7 lg:px-8 relative z-10 border border-white/80">
          
          {/* Top Bar: Pill Back Button & Switch to Sign In */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer bg-white hover:bg-slate-50 shadow-xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-xs font-medium text-slate-400">
              Remember password?{' '}
              <Link to="/login" className="text-[#4E66F8] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {step === 3 ? 'Password Reset!' : 'Forgot Password?'}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-400 font-medium mt-1">
              {step === 1 && 'Enter your registered email to receive an instant verification code'}
              {step === 2 && `Enter the 6-digit OTP sent to ${email} and your new password`}
              {step === 3 && 'Your account password has been updated successfully'}
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-600 border border-rose-200 p-2.5 text-xs font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && step !== 3 && (
            <div className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 p-2.5 text-xs font-semibold mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2.5">
                  <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Registered School Email"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-[#4E66F8] hover:bg-[#3D56EC] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#4E66F8]/25 hover:shadow-[#4E66F8]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Sending OTP Code...</span>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter OTP & New Password Form */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              
              {/* OTP Field */}
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <KeyRound className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="Enter 6-Digit OTP Code"
                    className="w-full bg-transparent text-sm font-bold tracking-widest text-slate-800 placeholder:text-slate-400 placeholder:tracking-normal focus:outline-none"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New Password (min 6 characters)"
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
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#4E66F8] transition-colors pb-2">
                  <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm New Password"
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

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-[#4E66F8] hover:bg-[#3D56EC] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#4E66F8]/25 hover:shadow-[#4E66F8]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verifying &amp; Resetting...</span>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Change Email
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleResendOtp}
                    className="text-[#4E66F8] hover:underline font-semibold disabled:opacity-50 disabled:no-underline cursor-pointer"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Success State */}
          {step === 3 && (
            <div className="space-y-4 pt-2 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Your Password Has Been Updated</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You can now log in to your HireHub school administration account using your new password.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full h-11 rounded-full bg-[#4E66F8] hover:bg-[#3D56EC] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#4E66F8]/25 hover:shadow-[#4E66F8]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
