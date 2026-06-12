import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSearch,
  Settings,
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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const schoolLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-candidates', label: 'My Candidates', icon: Users },
  { to: '/talent-pool', label: 'Talent Pool', icon: UserSearch },
  { to: '/credits', label: 'Credits', icon: Coins },
  { to: '/application-links', label: 'Application Links', icon: Link2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/admins', label: 'Admins', icon: School },
  { to: '/admin/plans', label: 'Plans', icon: Package },
  { to: '/admin/credit-packages', label: 'Credit Packages', icon: CreditCard },
  { to: '/admin/locations', label: 'Locations', icon: MapPin },
  { to: '/admin/import', label: 'Candidate Import', icon: Upload },
  { to: '/admin/applicant-plans', label: 'Applicant Plans', icon: CreditCard },
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

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="border-b p-6">
        <h1 className="text-lg font-bold text-primary">School Recruitment Network</h1>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {isSuperAdmin ? 'Super Admin' : isApplicant ? 'Self Applicant' : school?.schoolName || 'School Admin'}
        </p>
        {!isSuperAdmin && !isApplicant && school?.credits != null && (
          <p className="mt-2 text-sm font-semibold text-primary">Credits: {school.credits}</p>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <p className="mb-2 truncate text-sm font-medium">{user?.name}</p>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
