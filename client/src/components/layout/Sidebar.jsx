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
  const { user, school, logout, isSuperAdmin, isApplicant } = useAuth();
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

        {/* Dynamic Context Metadata Card */}
        <div className="mt-1 rounded-xl bg-slate-50/60 border border-slate-100 p-3 shadow-inner/5">
          <p className="truncate text-xs font-bold text-slate-700 leading-none">
            {isSuperAdmin ? 'Platform Management' : isApplicant ? 'Candidate Hub' : school?.schoolName || 'Recruitment Panel'}
          </p>
          
          {!isSuperAdmin && !isApplicant && school?.credits != null && (
            <div className="mt-2 flex items-center gap-1.5 border-t border-slate-200/40 pt-2 animate-in fade-in duration-300">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-500">
                Credits Remaining: <span className="font-extrabold text-slate-800">{school.credits}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Primary Context Links Grid */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
        {links.map(({ to, label, icon: Icon }) => (
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