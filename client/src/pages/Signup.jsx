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
  ShieldCheck, 
  Loader2 
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
        googleCredential: googleData.credential,
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

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#FAFBFC] text-slate-800 font-sans antialiased selection:bg-violet-600 selection:text-white relative flex flex-col justify-between items-center px-4 py-3 sm:py-5">
      
      {/* 1. Signature Homepage Floating Bubble Orbs */}
      <FloatingBubbles />

      {/* 2. Soft Ambient Radial Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-500/15 via-indigo-500/10 to-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 3. Top Floating Utility Bar (No navbar, just clean floating pills) */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 shadow-2xs backdrop-blur-md transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        <Link 
          to="/login" 
          className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-800 px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100/80 border border-violet-200/80 shadow-2xs backdrop-blur-md transition-all cursor-pointer"
        >
          <span>School Sign In</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 4. Center Auth Card (Fits viewport, smooth internal scroll if tiny screen) */}
      <div className="relative z-10 w-full max-w-[420px] my-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(8,41,92,0.12)] border border-slate-200/90 space-y-3.5 sm:space-y-4 max-h-[85dvh] overflow-y-auto">
          
          {/* Card Top: Brand Icon + Title */}
          <div className="text-center space-y-1">
            <Link to="/" className="inline-flex flex-col items-center group">
              <img
                src="/hirehub-brand-icon.png?v=5"
                alt="HireHub Logo"
                className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="mt-0.5 flex flex-col items-center">
                <span className="text-xl font-black tracking-tight text-[#08295C] font-sans leading-tight">
                  Hire<span className="text-[#12B9A5]">Hub</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
                  School Staff Recruitment OS
                </span>
              </div>
            </Link>

            <div className="pt-0.5">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {step === 1 ? 'Register School Free' : 'Verify Email'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {step === 1 
                  ? 'Digital recruitment portal for your campus' 
                  : `Enter 6-digit OTP sent to ${formData.email}`}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-600 border border-rose-200 p-2 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Registration Details Form */
            <form onSubmit={handleInitiateSignup} className="space-y-2.5">
              
              {/* School / Institute Name Field */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    placeholder="School / Institute Name"
                    className="w-full pl-9 pr-8 py-2 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                  />
                  {isNameValid && (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-emerald-500">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Official School Email"
                    className="w-full pl-9 pr-8 py-2 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                  />
                  {isEmailValid && (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-emerald-500">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Number Field */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="Contact Number (+91)"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {!googleData && (
                <>
                  {/* Password Field */}
                  <div className="space-y-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create Password (min 6 chars)"
                        className="w-full pl-9 pr-9 py-2 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm Password"
                        className="w-full pl-9 pr-9 py-2 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-600 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-1 space-y-2.5">
                <Button
                  type="submit"
                  disabled={otpLoading || mutation.isPending}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : mutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating School Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register School Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                <div className="relative flex items-center justify-center py-0.5">
                  <div className="w-full border-t border-slate-200" />
                  <span className="absolute bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Or
                  </span>
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
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-3.5">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-base font-black tracking-widest text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-600 transition-all text-center"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Valid for 10 minutes</span>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="text-violet-600 font-semibold hover:underline cursor-pointer"
                  >
                    Change Details
                  </button>
                </div>
              </div>

              <div className="pt-1 space-y-2.5">
                <Button
                  type="submit"
                  disabled={mutation.isPending || otp.length < 6}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying &amp; Creating School...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Create School</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Didn't receive code?</span>
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

          {/* Switch to Login */}
          <div className="pt-2 text-center text-xs text-slate-500 font-medium border-t border-slate-100">
            Already registered?{' '}
            <Link to="/login" className="text-violet-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* 5. Minimal Bottom Footer */}
      <div className="relative z-10 w-full max-w-md text-center shrink-0 pb-1">
        <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted &bull; Direct School Privacy</span>
        </p>
      </div>

    </div>
  );
}