import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { GoogleSignupButton } from '@/components/common/GoogleSignupButton';
import { registerSchool, sendSignupOtp } from '@/lib/api';
import ArtisticAuthVisual from '@/components/common/ArtisticAuthVisual';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans selection:bg-violet-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: RECRUITMENT IMAGE + MOVING ELEMENTS (ONE SIDE ONLY)
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[48%] lg:w-[50%] xl:w-[52%] min-h-screen sticky top-0 border-r border-slate-100 flex-col">
        <ArtisticAuthVisual 
          headline="Empowering schools" 
          highlight="to recruit top teachers"
          subtext="Join 150+ institutes building their faculty pipeline on HireHub with digital applications and zero agency commissions."
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: CLEAN, MINIMALIST SIGN UP FORM
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen flex flex-col justify-between items-center p-6 sm:p-8 lg:p-12 bg-white relative z-10 overflow-y-auto">
        
        {/* Top bar with back button & mobile brand */}
        <div className="w-full max-w-[420px] flex items-center justify-between pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="md:hidden flex items-center gap-2">
            <img 
              src="/hirehub-brand-icon.png?v=5" 
              alt="HireHub Logo" 
              className="w-7 h-7 object-contain" 
            />
            <span className="text-lg font-black text-[#08295C]">
              Hire<span className="text-[#12B9A5]">Hub</span>
            </span>
          </div>
        </div>

        {/* Center Minimal Form Box */}
        <div className="w-full max-w-[420px] my-auto py-3 space-y-5">
          
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
              {step === 1 ? 'Sign Up' : 'Verify Email'}
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {step === 1 ? 'Register your school to hire verified educators' : `Enter verification code sent to ${formData.email}`}
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 p-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="w-full flex justify-center">
                <GoogleSignupButton text="signup_with" onGoogleProfile={handleGoogleProfile} />
              </div>

              <div className="relative flex items-center justify-center py-0.5">
                <div className="w-full border-t border-slate-200/80"></div>
                <span className="absolute bg-white px-3 text-xs text-slate-400 font-normal">
                  Or register with email
                </span>
              </div>

              <form onSubmit={handleInitiateSignup} className="space-y-3">
                <div>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    placeholder="School / Institute Name"
                    className="w-full h-11 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Official School Email"
                    className="w-full h-11 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="Contact Number (+91)"
                    className="w-full h-11 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                  />
                </div>

                {!googleData && (
                  <>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Password (min 6 characters)"
                        className="w-full h-11 px-4 pr-11 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm Password"
                        className="w-full h-11 px-4 pr-11 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                )}

                <div className="pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 accent-violet-600 cursor-pointer"
                    />
                    <span>I agree to HireHub Terms &amp; School Privacy Policy</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={otpLoading || mutation.isPending}
                    className="w-full h-11 sm:h-12 rounded-xl bg-[#6355F6] hover:bg-[#5244E6] text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                  >
                    {otpLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Code...
                      </span>
                    ) : mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Setting Up School...
                      </span>
                    ) : (
                      <span>Sign Up Free</span>
                    )}
                  </button>
                </div>

                <div className="text-center text-xs text-slate-500 pt-1">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#4E66F8] font-bold hover:underline">
                    Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  className="w-full h-13 px-4 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-xl font-black tracking-[0.4em] text-slate-900 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 text-center focus:outline-none transition-all shadow-2xs"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Code valid for 10 mins</span>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="text-violet-600 font-semibold hover:underline cursor-pointer"
                >
                  Edit Details
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending || otp.length < 6}
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#6355F6] hover:bg-[#5244E6] text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span>Verify &amp; Create School</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendSignupOtp}
                  disabled={resendTimer > 0 || otpLoading}
                  className="inline-flex items-center gap-1 text-[#4E66F8] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${otpLoading ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2 text-[11px] text-slate-400">
            <span>&copy; {new Date().getFullYear()} HireHub &bull; School Staff Recruitment OS</span>
          </div>

        </div>

      </div>

    </div>
  );
}