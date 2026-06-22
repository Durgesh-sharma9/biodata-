import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Layers,
  Percent,
  MapPin,
  UploadCloud,
  FileCheck2,
  FolderTree,
  Users2,
  Briefcase,
  PiggyBank,
  Share2,
  UserSquare2,
  FileText,
  Inbox,
  CreditCard,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// हर एक लिंक के लिए एकदम सॉलिड और ब्राइट कलर (Hex Code) सेट किया है
const schoolLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#A05AFF' }, // Purple
  { to: '/my-candidates', label: 'My Candidates', icon: Users2, color: '#FF9F1C' }, // Orange
  { to: '/talent-pool', label: 'Talent Pool', icon: UserSquare2, color: '#3A86FF' }, // Blue
  { to: '/credits', label: 'Credits', icon: PiggyBank, color: '#1BCFB4' }, // Mint Teal
  { to: '/application-links', label: 'Application Links', icon: Share2, color: '#FF007A' }, // Pink
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#A05AFF' },
  { to: '/admin/admins', label: 'Admins', icon: ShieldAlert, color: '#FF4D4D' }, // Red
  { to: '/admin/plans', label: 'Plans', icon: Layers, color: '#FF9F1C' }, // Orange
  { to: '/admin/credit-packages', label: 'Credit Packages', icon: Percent, color: '#1BCFB4' }, // Teal
  { to: '/admin/locations', label: 'Locations', icon: MapPin, color: '#FF007A' }, // Pink
  { to: '/admin/import', label: 'Candidate Import', icon: UploadCloud, color: '#3A86FF' }, // Blue
  { to: '/admin/applicant-plans', label: 'Applicant Plans', icon: FileCheck2, color: '#00F5D4' }, // Neon Green
  { to: '/admin/master-data', label: 'Master Data', icon: FolderTree, color: '#9E58FF' }, // Violet
];

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#A05AFF' },
  { to: '/applicant/profile', label: 'My Profile', icon: UserSquare2, color: '#FF9F1C' },
  { to: '/applicant/documents', label: 'Documents', icon: FileText, color: '#3A86FF' },
  { to: '/applicant/requests', label: 'Received Requests', icon: Inbox, color: '#1BCFB4' },
  { to: '/applicant/plan', label: 'Active Plan', icon: CreditCard, color: '#FF007A' },
  { to: '/applicant/notifications', label: 'Notifications', icon: Bell, color: '#FF4D4D' },
];

export function Sidebar() {
  const { user, logout, isSuperAdmin, isApplicant } = useAuth();
  const links = isSuperAdmin ? adminLinks : isApplicant ? applicantLinks : schoolLinks;
  const roleLabel = isSuperAdmin ? 'Super Admin' : isApplicant ? 'Applicant' : 'Recruiter';

  return (
    <aside className="flex h-screen w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 sticky top-0 left-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand & Identity Segment */}
      <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Logo with smooth pulse glow */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1BCFB4] to-[#16b39c] text-white shadow-md shadow-[#1BCFB4]/30">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              HireHub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#A05AFF]/20 bg-[#A05AFF]/10 text-[#A05AFF] inline-block mt-1 shadow-sm">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-out select-none group relative overflow-hidden',
                isActive 
                  ? 'bg-[#A05AFF]/10 text-[#A05AFF] shadow-sm shadow-[#A05AFF]/5 translate-x-1.5' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[#A05AFF] dark:hover:text-white hover:translate-x-1.5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Left Neon Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-[#A05AFF] shadow-[0_0_8px_#A05AFF]" />
                )}
                
                {/* Icon Section - Guaranteed Color Output */}
                <Icon 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:scale-115 shrink-0",
                    isActive ? "drop-shadow-[0_2px_5px_rgba(160,90,255,0.4)]" : ""
                  )} 
                  style={{ color: color }} 
                />
                
                <span className="transition-colors duration-200">{label}</span>
                
                {/* Small Pulse Wave on Active Element */}
                {isActive && (
                  <div className="absolute right-4 h-1.5 w-1.5 rounded-full bg-[#A05AFF]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Footer & Logout */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-3 mb-2 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#9E58FF] to-[#A05AFF] text-white font-bold text-sm shadow-md shadow-[#9E58FF]/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Super Admin'}
            </p>
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1BCFB4] inline-block animate-pulse" />
              Secure Session
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 transition-all duration-300 hover:bg-[#FE9496]/10 hover:text-[#FE9496] group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-[#FE9496] group-hover:translate-x-0.5 transition-all duration-300" />
          Logout
        </button>
      </div>
    </aside>
  );
}