import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import Landing from '@/pages/Landing';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Candidates from '@/pages/Candidates';
import CandidateForm from '@/pages/CandidateForm';
import CandidateProfile from '@/pages/CandidateProfile';
import Settings from '@/pages/Settings';
import Schools from '@/pages/admin/Schools';
import PlatformStats from '@/pages/admin/PlatformStats';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <Navigate to={user.role === 'super_admin' ? '/admin/schools' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<RootRedirect />} />

            <Route
              element={
                <ProtectedRoute role="school_admin">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/new" element={<CandidateForm />} />
              <Route path="/candidates/:id" element={<CandidateProfile />} />
              <Route path="/candidates/:id/edit" element={<CandidateForm />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route
              element={
                <ProtectedRoute role="super_admin">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/schools" element={<Schools />} />
              <Route path="/admin/stats" element={<PlatformStats />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
