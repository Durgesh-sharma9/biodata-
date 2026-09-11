import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function getPostLoginRoute(role) {
  if (role === 'super_admin') return '/admin/dashboard';
  if (role === 'self_applicant' || role === 'applicant') return '/applicant/dashboard';
  return '/dashboard';
}

export function GoogleLoginButton({ targetRole, redirectTo, onSuccessCustom, text = 'continue_with' }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setLoading(true);
      if (!credentialResponse.credential) {
        throw new Error('Google authentication failed');
      }
      const res = await loginWithGoogle(credentialResponse.credential, targetRole);
      if (onSuccessCustom) {
        onSuccessCustom(res);
      } else {
        navigate(redirectTo || getPostLoginRoute(res.user?.role));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google Sign-In failed or was closed. Please try again.');
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {error && (
        <div className="w-full text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center gap-2 text-xs font-bold text-[#A05AFF] py-2">
          <span className="w-4 h-4 border-2 border-[#A05AFF] border-t-transparent rounded-full animate-spin" />
          Authenticating with Google...
        </div>
      ) : (
        <div className="w-full flex justify-center overflow-hidden rounded-xl">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            text={text}
            theme="outline"
            size="large"
            shape="pill"
            width="320"
            useOneTap={false}
          />
        </div>
      )}
    </div>
  );
}
