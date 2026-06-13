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

// 1. School / Recruiter Links with individual colors
const schoolLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500 group-hover:text-blue-600' },
  { to: '/my-candidates', label: 'My Candidates', icon: Users, color: 'text-purple-500 group-hover:text-purple-600' },
  { to: '/talent-pool', label: 'Talent Pool', icon: UserSearch, color: 'text-emerald-500 group-hover:text-emerald-600' },
  { to: '/credits', label: 'Credits', icon: Coins, color: 'text-amber-500 group-hover:text-amber-600' },
  { to: '/application-links', label: 'Application Links', icon: Link2, color: 'text-pink-500 group-hover:text-pink-600' },
];

// 2. Super Admin Links with individual colors
const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-sky-500 group-hover:text-sky-600' },
  { to: '/admin/admins', label: 'Admins', icon: School, color: 'text-violet-500 group-hover:text-violet-600' },
  { to: '/admin/plans', label: 'Plans', icon: Package, color: 'text-amber-500 group-hover:text-amber-600' },
  { to: '/admin/credit-packages', label: 'Credit Packages', icon: CreditCard, color: 'text-rose-500 group-hover:text-rose-600' },
  { to: '/admin/locations', label: 'Locations', icon: MapPin, color: 'text-teal-500 group-hover:text-teal-600' },
  { to: '/admin/import', label: 'Candidate Import', icon: Upload, color: 'text-indigo-500 group-hover:text-indigo-600' },
  { to: '/admin/applicant-plans', label: 'Applicant Plans', icon: CreditCard, color: 'text-fuchsia-500 group-hover:text-fuchsia-600' },
  { to: '/admin/master-data', label: 'Master Data', icon: Database, color: 'text-blue-600 group-hover:text-blue-700' },
];

// 3. Applicant Links with individual colors
const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500 group-hover:text-blue-600' },
  { to: '/applicant/profile', label: 'My Profile', icon: Users, color: 'text-purple-500 group-hover:text-purple-600' },
  { to: '/applicant/documents', label: 'Documents', icon: FileText, color: 'text-emerald-500 group-hover:text-emerald-600' },
  { to: '/applicant/requests', label: 'Received Requests', icon: Inbox, color: 'text-amber-500 group-hover:text-amber-600' },
  { to: '/applicant/plan', label: 'Active Plan', icon: CreditCard, color: 'text-pink-500 group-hover:text-pink-600' },
  { to: '/applicant/notifications', label: 'Notifications', icon: Bell, color: 'text-indigo-500 group-hover:text-indigo-600' },
];

export function Sidebar() {
  const { user, logout, isSuperAdmin, isApplicant } = useAuth();
  const links = isSuperAdmin ? adminLinks : isApplicant ? applicantLinks : schoolLinks;

  // Determine role pill label text
  const roleLabel = isSuperAdmin ? 'Super Admin' : isApplicant ? 'Applicant' : 'Recruiter';

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200/60 bg-white/95 backdrop-blur-md sticky top-0 left-0 z-30">
      {/* Brand & Identity Segment */}
      <div className="border-b border-slate-100 p-6 bg-gradient-to-b from-slate-50/50 to-transparent flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">
              HireHub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Context Links Grid */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
        {links.map(({ to, label, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 select-none group relative active:scale-[0.98]',
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-200 group-hover:scale-110", 
                  isActive ? "text-white" : color
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

      {/* Profile Footer & Logout Action Control */}
      <div className="border-t border-slate-100 p-4 bg-gradient-to-t from-slate-50/40 to-transparent">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 border border-slate-100 p-3 mb-2 shadow-inner/5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 leading-tight">
              {user?.name || 'Authorized Account'}
            </p>
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              Secure Session
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