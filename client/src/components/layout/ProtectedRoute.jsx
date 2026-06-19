import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Briefcase } from 'lucide-react';

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f3f3f4] dark:bg-slate-950 antialiased relative">
        
        <div className="relative flex flex-col items-center">
          {/* Flat Standardized Container aligned with the primary design system */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 mb-5 shadow-sm">
            <div className="absolute inset-0 rounded-xl bg-[#A05AFF]/5 opacity-100" />
            <Briefcase className="h-8 w-8 text-[#A05AFF]" />
            
            {/* Precision Micro Spinner Orbit Ring tied to primary accent hue */}
            <div className="absolute -inset-1.5 animate-spin rounded-xl border-2 border-[#A05AFF] border-t-transparent border-r-transparent duration-700" />
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
              <span className="w-1 h-1 rounded-full bg-[#A05AFF] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 rounded-full bg-[#A05AFF] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 rounded-full bg-[#A05AFF] animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  }

  return children;
}