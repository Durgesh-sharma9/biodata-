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
import Credits from '@/pages/Credits';
import ApplicationLinks from '@/pages/ApplicationLinks';
import Apply from '@/pages/Apply';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Admins from '@/pages/admin/Admins';
import Plans from '@/pages/admin/Plans';
import CreditPackages from '@/pages/admin/CreditPackages';
import Locations from '@/pages/admin/Locations';
import CandidateImport from '@/pages/admin/CandidateImport';
import ApplicantSignup from '@/pages/applicant/ApplicantSignup';
import ApplicantLogin from '@/pages/applicant/ApplicantLogin';
import ApplicantProfile from '@/pages/applicant/ApplicantProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function getDefaultRoute(role) {
  if (role === 'super_admin') return '/admin/dashboard';
  if (role === 'self_applicant') return '/applicant/profile';
  return '/dashboard';
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <Navigate to={getDefaultRoute(user.role)} replace />;
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
            <Route path="/apply/:slug" element={<Apply />} />
            <Route path="/applicant/signup" element={<ApplicantSignup />} />
            <Route path="/applicant/login" element={<ApplicantLogin />} />
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
              <Route path="/credits" element={<Credits />} />
              <Route path="/application-links" element={<ApplicationLinks />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route
              element={
                <ProtectedRoute role="super_admin">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/admins" element={<Admins />} />
              <Route path="/admin/plans" element={<Plans />} />
              <Route path="/admin/credit-packages" element={<CreditPackages />} />
              <Route path="/admin/locations" element={<Locations />} />
              <Route path="/admin/import" element={<CandidateImport />} />
              <Route path="/admin/schools" element={<Navigate to="/admin/admins" replace />} />
              <Route path="/admin/stats" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route
              element={
                <ProtectedRoute role="self_applicant">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/applicant/profile" element={<ApplicantProfile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
