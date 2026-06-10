import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi } from '@/lib/api';

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
      .catch(() => {
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSchool(null);
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
        logout,
        refreshSchool,
        isSuperAdmin: user?.role === 'super_admin',
        isApplicant: user?.role === 'self_applicant',
        isSchoolAdmin: user?.role === 'school_admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
