import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, googleLogin as googleLoginApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => {
        setUser(res.data.user);
        setSchool(res.data.school);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      })
      .catch((err) => {
        console.warn('[Auth Initialization Note]: Session expired or no valid session:', err?.response?.data?.message || err?.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);

    const meRes = await getMe();
    setSchool(meRes.data.school);
    return res.data;
  };

  const loginWithGoogle = async (credential, targetRole) => {
    const res = await googleLoginApi({ credential, targetRole });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);

    const meRes = await getMe();
    setSchool(meRes.data.school);
    return res.data;
  };

  const [isImpersonating, setIsImpersonating] = useState(() => Boolean(localStorage.getItem('originalAdminToken')));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('originalAdminToken');
    localStorage.removeItem('originalAdminUser');
    setIsImpersonating(false);
    setUser(null);
    setSchool(null);
  };

  const impersonate = async (impersonateData) => {
    // Save current Super Admin session before switching
    const currentToken = localStorage.getItem('token');
    const currentUser = localStorage.getItem('user');
    if (currentToken && !localStorage.getItem('originalAdminToken')) {
      localStorage.setItem('originalAdminToken', currentToken);
      localStorage.setItem('originalAdminUser', currentUser);
    }

    // Set new school admin session
    localStorage.setItem('token', impersonateData.token);
    localStorage.setItem('user', JSON.stringify(impersonateData.user));
    setIsImpersonating(true);
    setUser(impersonateData.user);
    setSchool(impersonateData.school);

    return impersonateData;
  };

  const exitImpersonation = async () => {
    const originalToken = localStorage.getItem('originalAdminToken');
    const originalUser = localStorage.getItem('originalAdminUser');

    if (originalToken && originalUser) {
      localStorage.setItem('token', originalToken);
      localStorage.setItem('user', originalUser);
      localStorage.removeItem('originalAdminToken');
      localStorage.removeItem('originalAdminUser');
      setIsImpersonating(false);

      const parsedUser = JSON.parse(originalUser);
      setUser(parsedUser);
      setSchool(null);

      try {
        const meRes = await getMe();
        setUser(meRes.data.user);
      } catch (e) {
        console.warn('Failed to refresh original admin session', e);
      }
    }
  };

  const refreshSchool = async () => {
    const meRes = await getMe();
    setUser(meRes.data.user);
    setSchool(meRes.data.school);
    localStorage.setItem('user', JSON.stringify(meRes.data.user));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        school,
        loading,
        login,
        loginWithGoogle,
        logout,
        impersonate,
        exitImpersonation,
        isImpersonating,
        refreshSchool,
        isSuperAdmin: user?.role === 'super_admin',
        isApplicant: user?.role === 'self_applicant' || user?.role === 'applicant',
        isSchoolAdmin: user?.role === 'school_admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
