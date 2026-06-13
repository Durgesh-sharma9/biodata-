import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Briefcase } from 'lucide-react';

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100/60 to-indigo-50/20 antialiased relative overflow-hidden">
        {/* Ambient background blur spots matching layout context */}
        <div className="absolute top-1/3 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-blue-400/10 via-indigo-400/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          {/* Pulsing Core Branding Outer Track */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl shadow-indigo-500/10 border border-slate-100 mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 opacity-10 animate-pulse" />
            <Briefcase className="h-8 w-8 text-indigo-600 animate-bounce duration-1000" />
            
            {/* Precision Micro Spinner Orbit Ring */}
            <div className="absolute -inset-1.5 animate-spin rounded-2xl border-2 border-indigo-500 border-t-transparent border-r-transparent duration-700" />
          </div>

          {/* Premium Spatial Metadata Loading Indicators */}
          <h3 className="text-sm font-bold tracking-wider uppercase text-slate-800">
            HireHub Secure Gateway
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <p className="text-xs font-semibold text-slate-400/90">
              Verifying credentials
            </p>
            <span className="inline-flex gap-0.5 ml-0.5">
              <span className="w-1 h-1 rounded-full bg-indigo-500/60 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 rounded-full bg-indigo-500/60 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 rounded-full bg-indigo-500/60 animate-bounce" />
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