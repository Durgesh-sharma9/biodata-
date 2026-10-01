import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

/**
 * GoogleSignupButton — for SIGNUP pages only.
 * Unlike GoogleLoginButton, this does NOT call the backend.
 * It simply decodes the Google JWT and passes the profile
 * (email, name, avatarUrl, googleId) to onGoogleProfile callback.
 * The parent component is responsible for the actual registration call.
 */
export function GoogleSignupButton({ onGoogleProfile, text = 'signup_with' }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = (credentialResponse) => {
    try {
      setError('');
      setLoading(true);

      const credential = credentialResponse.credential;
      if (!credential) {
        throw new Error('Google authentication failed');
      }

      // Decode JWT payload (no backend call needed for signup pre-fill)
      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid Google token');
      }
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      if (!payload?.email) {
        throw new Error('Google did not provide an email address');
      }

      onGoogleProfile({
        email: payload.email,
        name: payload.name || payload.given_name || '',
        avatarUrl: payload.picture || null,
        googleId: payload.sub,
        credential, // pass raw credential for backend verification
      });
    } catch (err) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
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
        <div className="flex items-center gap-2 text-xs font-bold text-violet-600 py-2">
          <span className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          Getting Google profile...
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
