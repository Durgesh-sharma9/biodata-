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

// Links updated to conform strictly to consistent slate micro-colors when inactive
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
    <aside className="flex h-full w-full flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/50 z-30">
      {/* Premium Branding Header Segment */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5">
          {/* Main platform logo badge using Success / Mint Teal design */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1BCFB4]">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              HireHub
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Applicant
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Row Links */}
      <nav className="flex-1 space-y-1 p-5 overflow-y-auto">
        {applicantLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 select-none group relative',
                isActive 
                  ? 'bg-[#A05AFF]/10 text-[#A05AFF]' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-200 group-hover:scale-105", 
                  isActive ? "text-[#A05AFF]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} />
                <span>{label}</span>
                {isActive && (
                  <div className="absolute right-4 h-1.5 w-1.5 rounded-full bg-[#A05AFF]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Footer & Logout Control Section */}
      <div className="p-5 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-3 mb-3 shadow-sm">
          {/* Avatar frame aligned tightly with Secondary deep purple accent */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9E58FF] text-white font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Applicant Account'}
            </p>
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
              Active Session
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-[#FE9496]/5 hover:text-[#FE9496] dark:hover:bg-[#FE9496]/10 group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-[#FE9496] transition-colors duration-200" />
          Logout
        </button>
      </div>
    </aside>
  );
}