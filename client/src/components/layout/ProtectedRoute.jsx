import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Briefcase } from 'lucide-react';

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F4F7F6] dark:bg-slate-950 antialiased relative">
        
        <div className="relative flex flex-col items-center">
          {/* Flat Standardized Container aligned with the primary design system */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 mb-5 shadow-sm">
            <div className="absolute inset-0 rounded-xl bg-[#0F766E]/5 opacity-100" />
            <Briefcase className="h-8 w-8 text-[#0F766E]" />
            
            {/* Precision Micro Spinner Orbit Ring tied to primary accent hue */}
            <div className="absolute -inset-1.5 animate-spin rounded-xl border-2 border-[#0F766E] border-t-transparent border-r-transparent duration-700" />
          </div>

          {/* Core Branding Section Typography Headers */}
          <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">
            HIREHUB SECURE GATEWAY
          </h3>
          
          {/* Metadata Subtitles and Soft Dots */}
          <div className="flex items-center gap-1 mt-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Verifying credentials
            </p>
            <span className="inline-flex gap-0.5 ml-0.5">
              <span className="w-1 h-1 rounded-full bg-[#0F766E] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 rounded-full bg-[#0F766E] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 rounded-full bg-[#0F766E] animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.warn('[ProtectedRoute] No active user session found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) {
      console.warn(`[ProtectedRoute] Access denied for role "${user.role}". Required: [${allowed.join(', ')}]. Redirecting to default.`);
      if (user.role === 'applicant' || user.role === 'self_applicant') {
        return <Navigate to="/applicant/dashboard" replace />;
      }
      if (user.role === 'super_admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
}