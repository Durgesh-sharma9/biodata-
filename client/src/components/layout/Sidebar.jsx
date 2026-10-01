import { NavLink, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMySchool } from '@/lib/api';
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
  Building2,
  SlidersHorizontal,
  UserPlus,
  QrCode,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// Milestone 1: Pure School Biodata Management Links
const schoolLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#0F766E' },
  { to: '/my-candidates', label: 'Biodata List', icon: Users2, color: '#FF9F1C' },
  { to: '/candidates/new', label: 'Add Biodata', icon: UserPlus, color: '#3A86FF' },
  { to: '/application-links', label: 'QR & Apply Links', icon: QrCode, color: '#FF007A' },
  { to: '/school-profile', label: 'School Profile', icon: Building2, color: '#14B8A6' },
  { to: '/settings', label: 'Settings', icon: SlidersHorizontal, color: '#06D6A0' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#0F766E' },
  { to: '/admin/admins', label: 'Admins', icon: ShieldAlert, color: '#FF4D4D' }, // Red
  { to: '/admin/plans', label: 'Plans', icon: Layers, color: '#FF9F1C' }, // Orange
  { to: '/admin/credit-packages', label: 'Credit Packages', icon: Percent, color: '#1BCFB4' }, // Teal
  { to: '/admin/locations', label: 'Locations', icon: MapPin, color: '#FF007A' }, // Pink
  { to: '/admin/import', label: 'Candidate Import', icon: UploadCloud, color: '#3A86FF' }, // Blue
  { to: '/admin/applicant-plans', label: 'Applicant Plans', icon: FileCheck2, color: '#00F5D4' }, // Neon Green
  { to: '/admin/master-data', label: 'Master Data', icon: FolderTree, color: '#14B8A6' }, // Violet
  { to: '/admin/marquee', label: 'Partner Marquee', icon: SlidersHorizontal, color: '#8A3BD4' }, // Purple
];

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#0F766E' },
  { to: '/applicant/profile', label: 'My Profile', icon: UserSquare2, color: '#FF9F1C' },
  { to: '/applicant/documents', label: 'Documents', icon: FileText, color: '#3A86FF' },
  { to: '/applicant/requests', label: 'Received Requests', icon: Inbox, color: '#1BCFB4' },
  { to: '/applicant/plan', label: 'Active Plan', icon: CreditCard, color: '#FF007A' },
  { to: '/applicant/notifications', label: 'Notifications', icon: Bell, color: '#FF4D4D' },
];

export function Sidebar({ onNavigate }) {
  const { user, school: authSchool, logout, isSuperAdmin, isApplicant } = useAuth();
  
  const { data: mySchoolData } = useQuery({
    queryKey: ['mySchool'],
    queryFn: () => getMySchool().then((r) => r.data.data),
    enabled: !isSuperAdmin && !isApplicant,
    staleTime: 30000,
  });

  const school = mySchoolData || authSchool;
  const links = isSuperAdmin ? adminLinks : isApplicant ? applicantLinks : schoolLinks;
  const roleLabel = isSuperAdmin ? 'Super Admin' : isApplicant ? 'Applicant' : 'Recruiter';

  return (
    <aside className="flex h-full w-full flex-col bg-white dark:bg-slate-900 border-r border-[#E2EAE7] dark:border-slate-800/80 z-30 shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-[#E2EAE7] dark:border-slate-800/50 flex items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/hirehub-logo-transparent.png"
            alt="HireHub Logo"
            className="h-8 w-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
            Hire<span className="bg-gradient-to-r from-[#8A3BD4] to-[#00D2FF] bg-clip-text text-transparent">Hub</span>
          </h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold tracking-normal transition-all duration-150 select-none group',
                isActive
                  ? 'bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#A855F7] text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50/70 dark:hover:bg-slate-800/60 hover:text-[#8A3BD4]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110"
                  style={{ color: isActive ? '#ffffff' : color }}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-200" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-3 border-t border-[#E2EAE7] dark:border-slate-800/50 bg-slate-50/60 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E2EAE7] dark:border-slate-700/50 p-2 mb-1.5 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-tr from-[#8A3BD4] to-[#A855F7] text-white font-bold text-xs shadow-xs">
            {school?.logoUrl ? (
              <img src={school.logoUrl} alt="Logo" className="h-full w-full object-contain p-0.5 bg-white" />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              'A'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {school?.schoolName || user?.name || 'School Principal'}
            </p>
            <p className="truncate text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D2FF] inline-block animate-pulse shadow-[0_0_8px_#00D2FF]" />
              {user?.name || 'Secure Session'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 group"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all duration-200" />
          Logout
        </button>
      </div>
    </aside>
  );
}