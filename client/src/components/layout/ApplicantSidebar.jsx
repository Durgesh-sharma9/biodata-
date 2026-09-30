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
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applicant/profile', label: 'My Profile', icon: User },
  { to: '/applicant/documents', label: 'Documents & CV', icon: FileText },
  { to: '/applicant/requests', label: 'Received Requests', icon: Inbox },
  { to: '/applicant/plan', label: 'Plans & Credits', icon: CreditCard },
  { to: '/applicant/notifications', label: 'Notifications', icon: Bell },
];

export function ApplicantSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-full flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-r border-slate-200/80 dark:border-slate-800 z-30 select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E2EAE7] dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] shadow-xs">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Hire<span className="text-[#0F766E]">Hub</span>
            </h1>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Candidate Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        <p className="px-2.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Navigation
        </p>
        {applicantLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-150 group relative',
                isActive
                  ? 'bg-[#0F766E] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-[#F0FDFA] hover:text-[#0F766E] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'h-4 w-4 transition-transform duration-150 group-hover:scale-110 shrink-0',
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  )}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-blue-600/70 dark:text-blue-400/70" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
        <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 mb-2 shadow-xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
              {user?.name || 'Candidate User'}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Talent Pool</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}