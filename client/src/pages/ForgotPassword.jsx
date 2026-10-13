import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  RefreshCw,
  Building2,
  Mail,
  Lock,
  ShieldCheck
} from 'lucide-react';
import ArtisticAuthVisual, { ArtisticAuthBackground } from '@/components/common/ArtisticAuthVisual';
import FloatingBubbles from '@/components/common/FloatingBubbles';
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
      setResendTimer(60);
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
    <div className="min-h-screen w-full relative flex flex-col md:flex-row font-sans selection:bg-violet-600 selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          FULL-SCREEN BACKGROUND: RECRUITMENT IMAGE + ARTISTIC SHAPES
          (Spans 100% of the entire viewport, edge-to-edge)
      ───────────────────────────────────────────────────────────── */}
      <ArtisticAuthBackground />

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: EDITORIAL HEADLINE & BADGES (ON TOP OF FULL IMAGE)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[50%] xl:w-[54%] min-h-screen sticky top-0 flex-col shrink-0 min-w-0 z-10">
        <ArtisticAuthVisual 
          headline="Secure access" 
          highlight="for your institution"
          subtext="Easily recover your school administration credentials with encrypted email verification."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: MODERN, ELEVATED, RICH FORM CANVAS (MATCHING LANDING THEME)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full md:w-[52%] lg:w-[50%] xl:w-[46%] flex-1 min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 xl:p-12 relative z-10 overflow-hidden min-w-0">
        
        {/* RANDOMLY MOVING BUBBLE ORBS (SAME AS LANDING PAGE, CONTAINED TO RIGHT SIDE ONLY) */}
        <FloatingBubbles embedded={true} />

        {/* Mobile-Only Top Brand Bar */}
        <div className="md:hidden w-full max-w-[440px] flex items-center justify-between pt-2 pb-2 shrink-0 relative z-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/hirehub-brand-icon.png?v=5" 
              alt="HireHub Logo" 
              className="h-8 w-auto object-contain" 
            />
            <span className="text-xl font-black text-[#08295C] leading-none">
              Hire<span className="text-[#12B9A5]">Hub</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700">
            <Building2 className="w-3 h-3 text-amber-500" /> 150+ Schools
          </span>
        </div>

        {/* ─── ELEVATED FLOATING FORM CARD (RICH LIGHT BOX) ─── */}
        <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-white/90 ring-1 ring-slate-200/80 my-auto space-y-4 relative z-20 overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold transition-all cursor-pointer bg-white hover:bg-slate-50 shadow-2xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <Link to="/login" className="text-xs font-bold text-violet-600 hover:underline">
              Back to Login
            </Link>
          </div>

          {/* Heading */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 text-violet-700 text-[11px] font-bold mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
              <Building2 className="w-3 h-3 text-violet-600" />
              <span>Account Recovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {step === 3 ? (
                'Password Updated!'
              ) : (
                <>
                  Reset Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
                    Password
                  </span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1">
              {step === 1 && 'Enter your registered school email to get a recovery OTP'}
              {step === 2 && `Enter the 6-digit code sent to ${email} and set a new password`}
              {step === 3 && 'Your credentials have been securely updated.'}
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && step !== 3 && (
            <div className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Official School Email
                </label>
                <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                  <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3.5 mr-2.5 shrink-0 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@school.edu.in"
                    className="w-full bg-transparent py-2.5 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 text-center">
                  6-Digit OTP Code
                </label>
                <div className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs p-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="• • • • • •"
                    className="w-full bg-transparent text-xl font-black tracking-[0.3em] text-slate-900 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 text-center focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  New Password
                </label>
                <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3.5 mr-2.5 shrink-0 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full bg-transparent py-2.5 pr-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-3"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Confirm New Password
                </label>
                <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3.5 mr-2.5 shrink-0 transition-colors" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full bg-transparent py-2.5 pr-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-3"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating Password...
                    </span>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1 text-violet-600 font-bold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-4 pt-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <p className="text-xs text-slate-600 font-medium">Your password has been changed successfully. You can now log in with your new credentials.</p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>Continue to Login</span>
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Trust Note */}
        <div className="text-center shrink-0 pt-3 pb-1">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Authentication &bull; School Privacy Protection</span>
          </p>
        </div>

      </div>

    </div>
  );
}
