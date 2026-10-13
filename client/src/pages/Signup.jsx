import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GoogleSignupButton } from '@/components/common/GoogleSignupButton';
import { registerSchool, sendSignupOtp } from '@/lib/api';
import ArtisticAuthVisual, { ArtisticAuthBackground } from '@/components/common/ArtisticAuthVisual';
import FloatingBubbles from '@/components/common/FloatingBubbles';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle, 
  RefreshCw,
  Building2,
  Mail,
  Phone,
  Lock,
  Check,
  ShieldCheck,
  User
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
  const [agreeTerms, setAgreeTerms] = useState(true);

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

  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to terms & conditions to proceed');
      return;
    }

    if (!googleData && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!googleData && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

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
          headline="Empowering schools" 
          highlight="to recruit top teachers"
          subtext="Join 150+ institutes building their faculty pipeline on HireHub with digital applications and zero agency commissions."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: MODERN, ELEVATED, RICH FORM CANVAS (MATCHING LANDING THEME)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full md:w-[52%] lg:w-[50%] xl:w-[46%] flex-1 min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 xl:p-12 relative z-10 overflow-hidden min-w-0">
        
        {/* RANDOMLY MOVING BUBBLE ORBS (SAME AS LANDING PAGE, CONTAINED TO RIGHT SIDE ONLY) */}
        <FloatingBubbles embedded={true} />

        {/* Mobile-Only Top Brand Bar */}
        <div className="md:hidden w-full max-w-[460px] flex items-center justify-between pt-2 pb-2 shrink-0 relative z-20">
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
        <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-white/90 ring-1 ring-slate-200/80 my-auto space-y-4 relative z-20 overflow-hidden">
          
          {/* Top Bar: Back Button & Switch to Login */}
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

            <div className="text-xs font-medium text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="text-violet-600 font-bold hover:text-violet-700 hover:underline">
                Sign In
              </Link>
            </div>
          </div>

          {/* Heading with Brand Badge */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 text-violet-700 text-[11px] font-bold mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
              <Building2 className="w-3 h-3 text-violet-600" />
              <span>{step === 1 ? 'School Registration Portal' : 'Email Verification'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {step === 1 ? (
                <>
                  Register Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
                    School
                  </span>
                </>
              ) : (
                'Verify School Email'
              )}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1">
              {step === 1 
                ? 'Create your free account to recruit verified teachers directly.'
                : `Enter the 6-digit verification code sent to ${formData.email}`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Google One-Click Registration */}
              <div className="w-full flex justify-center">
                <GoogleSignupButton text="signup_with" onGoogleProfile={handleGoogleProfile} />
              </div>

              {/* Clean Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-slate-200/90" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0">
                  Or register with details
                </span>
                <div className="flex-1 h-px bg-slate-200/90" />
              </div>

              <form onSubmit={handleInitiateSignup} className="space-y-3">
                
                {/* School Name Field */}
                <div className="space-y-1">
                  <label htmlFor="schoolName" className="block text-xs font-bold text-slate-700">
                    School / Institute Name
                  </label>
                  <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                    <Building2 className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3.5 mr-2.5 shrink-0 transition-colors" />
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Delhi Public School"
                      className="w-full bg-transparent py-2.5 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                    Official School Email
                  </label>
                  <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3.5 mr-2.5 shrink-0 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="admin@school.edu.in"
                      className="w-full bg-transparent py-2.5 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="space-y-1">
                  <label htmlFor="mobile" className="block text-xs font-bold text-slate-700">
                    Contact Number (+91)
                  </label>
                  <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                    <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3.5 mr-2.5 shrink-0 transition-colors" />
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="98765 43210"
                      className="w-full bg-transparent py-2.5 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Fields (if not Google Data) */}
                {!googleData && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                        <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3 mr-2 shrink-0 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Min 6 chars"
                          className="w-full bg-transparent py-2.5 pr-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-2.5"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700">
                        Confirm Password
                      </label>
                      <div className="group relative flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs">
                        <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 ml-3 mr-2 shrink-0 transition-colors" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Repeat"
                          className="w-full bg-transparent py-2.5 pr-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-2.5"
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms agreement */}
                <div className="pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 accent-violet-600 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">I agree to HireHub Terms &amp; School Privacy Policy</span>
                  </label>
                </div>

                {/* Primary CTA Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={otpLoading || mutation.isPending}
                    className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 group"
                  >
                    {otpLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Verification Code...
                      </span>
                    ) : mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Setting Up School Portal...
                      </span>
                    ) : (
                      <>
                        <span>Create Free School Account</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </>
          ) : (
            /* STEP 2: VERIFY OTP */
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="otp" className="block text-xs font-bold text-slate-700 text-center">
                  Enter 6-Digit Email Code
                </label>
                <div className="relative flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all shadow-2xs p-2">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    className="w-full bg-transparent text-2xl font-black tracking-[0.4em] text-slate-900 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 text-center focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Code valid for 10 mins</span>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="text-violet-600 font-bold hover:underline cursor-pointer"
                >
                  Edit Details
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending || otp.length < 6}
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <span>Verify &amp; Launch Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendSignupOtp}
                  disabled={resendTimer > 0 || otpLoading}
                  className="inline-flex items-center gap-1.5 text-violet-600 font-bold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${otpLoading ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Bottom Trust Note */}
        <div className="text-center shrink-0 pt-3 pb-1">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free School Registration &bull; Direct Hiring &bull; Zero Fees</span>
          </p>
        </div>

      </div>

    </div>
  );
}