import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSearch,
  Database,
  School,
  LogOut,
  CreditCard,
  Link2,
  MapPin,
  Package,
  Upload,
  Coins,
  Inbox,
  FileText,
  Bell,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// Standardized list arrays removing chaotic multi-color overrides
const schoolLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-candidates', label: 'My Candidates', icon: Users },
  { to: '/talent-pool', label: 'Talent Pool', icon: UserSearch },
  { to: '/credits', label: 'Credits', icon: Coins },
  { to: '/application-links', label: 'Application Links', icon: Link2 },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/admins', label: 'Admins', icon: School },
  { to: '/admin/plans', label: 'Plans', icon: Package },
  { to: '/admin/credit-packages', label: 'Credit Packages', icon: CreditCard },
  { to: '/admin/locations', label: 'Locations', icon: MapPin },
  { to: '/admin/import', label: 'Candidate Import', icon: Upload },
  { to: '/admin/applicant-plans', label: 'Applicant Plans', icon: CreditCard },
  { to: '/admin/master-data', label: 'Master Data', icon: Database },
];

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applicant/profile', label: 'My Profile', icon: Users },
  { to: '/applicant/documents', label: 'Documents', icon: FileText },
  { to: '/applicant/requests', label: 'Received Requests', icon: Inbox },
  { to: '/applicant/plan', label: 'Active Plan', icon: CreditCard },
  { to: '/applicant/notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar() {
  const { user, logout, isSuperAdmin, isApplicant } = useAuth();
  const links = isSuperAdmin ? adminLinks : isApplicant ? applicantLinks : schoolLinks;

  // Determine role pill label text
  const roleLabel = isSuperAdmin ? 'Super Admin' : isApplicant ? 'Applicant' : 'Recruiter';

  return (
    <aside className="flex h-screen w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/50 sticky top-0 left-0 z-30">
      {/* Brand & Identity Segment */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          {/* Main logo tracking utilizing the Success / Mint Teal signature color */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1BCFB4]">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              HireHub
            </h1>
            {/* Soft-Tint Badge rendering base specs */}
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xl border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] inline-block mt-0.5">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Context Links Grid */}
      <nav className="flex-1 space-y-1 p-5 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
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

      {/* Profile Footer & Logout Action Control */}
      <div className="p-5 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-3 mb-3 shadow-sm">
          {/* Avatar container matching Deep Purple Secondary Accent specification */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9E58FF] text-white font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Authorized Account'}
            </p>
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
              Secure Session
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