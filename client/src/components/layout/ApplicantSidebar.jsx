import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Inbox,
  CreditCard,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applicant/profile', label: 'My Profile', icon: User },
  { to: '/applicant/documents', label: 'Documents', icon: FileText },
  { to: '/applicant/requests', label: 'Received Requests', icon: Inbox },
  { to: '/applicant/plan', label: 'My Plan', icon: CreditCard },
  { to: '/applicant/notifications', label: 'Notifications', icon: Bell },
];

export function ApplicantSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200/60 bg-white/95 backdrop-blur-md sticky top-0 left-0 z-30">
      {/* Premium Branding Header Segment */}
      <div className="border-b border-slate-100 p-6 bg-gradient-to-b from-slate-50/50 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              HireHub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
              Applicant
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Row Links */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
        {applicantLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 select-none group relative active:scale-[0.98]',
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-200 group-hover:scale-110", 
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                )} />
                <span>{label}</span>
                {isActive && (
                  <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Footer & Logout Control Section */}
      <div className="border-t border-slate-100 p-4 bg-gradient-to-t from-slate-50/40 to-transparent">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 border border-slate-100 p-3 mb-2 shadow-inner/5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 leading-tight">
              {user?.name || 'Applicant Account'}
            </p>
            <p className="truncate text-xs font-medium text-slate-400 mt-0.5">
              Secure Session Active
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98] group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors duration-200 group-hover:translate-x-0.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}