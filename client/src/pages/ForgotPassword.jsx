import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import ArtisticAuthVisual from '@/components/common/ArtisticAuthVisual';
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans selection:bg-violet-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: RECRUITMENT IMAGE + MOVING ELEMENTS (ONE SIDE ONLY)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[50%] xl:w-[52%] min-h-screen sticky top-0 border-r border-slate-100 flex-col">
        <ArtisticAuthVisual 
          headline="Secure access" 
          highlight="for your institution"
          subtext="Easily recover your school administration credentials with encrypted email verification."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: CLEAN, MINIMALIST RECOVERY FORM
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen flex flex-col justify-between items-center p-6 sm:p-8 lg:p-12 bg-white relative z-10 overflow-y-auto">
        
        {/* Top bar */}
        <div className="w-full max-w-[400px] flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <Link to="/login" className="text-xs font-medium text-[#4E66F8] hover:underline">
            Back to Login
          </Link>
        </div>

        {/* Center Minimal Form Box */}
        <div className="w-full max-w-[400px] my-auto py-3 space-y-5">
          
          <div className="flex flex-col items-center justify-center text-center">
            <Link to="/" className="inline-block group mb-2">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-sky-400 p-[2px] shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <img 
                    src="/hirehub-brand-icon.png?v=5" 
                    alt="HireHub" 
                    className="w-8 h-8 object-contain" 
                  />
                </div>
              </div>
            </Link>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {step === 3 ? 'Password Updated!' : 'Reset Password'}
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {step === 1 && 'Enter your registered school email to get a recovery OTP'}
              {step === 2 && `Enter the 6-digit code sent to ${email} and set new password`}
              {step === 3 && 'Your credentials have been securely updated.'}
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && step !== 3 && (
            <div className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Official School Email"
                  className="w-full h-12 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#6355F6] hover:bg-[#5244E6] text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    <span>Send Recovery Code</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="• • • • • •"
                  className="w-full h-12 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-lg font-black tracking-[0.3em] text-slate-900 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 text-center focus:outline-none transition-all shadow-2xs"
                  autoFocus
                />
              </div>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New Password (min 6 characters)"
                  className="w-full h-11 px-4 pr-11 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm New Password"
                  className="w-full h-11 px-4 pr-11 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#6355F6] hover:bg-[#5244E6] text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
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

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-800 font-medium"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1 text-[#4E66F8] font-bold hover:underline disabled:opacity-50 cursor-pointer"
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
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full h-12 rounded-xl bg-[#6355F6] hover:bg-[#5244E6] text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>Continue to Login</span>
                </Link>
              </div>
            </div>
          )}

          <div className="text-center pt-2 text-[11px] text-slate-400">
            <span>&copy; {new Date().getFullYear()} HireHub &bull; School Staff Recruitment OS</span>
          </div>

        </div>

      </div>

    </div>
  );
}
