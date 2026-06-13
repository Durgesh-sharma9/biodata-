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
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="border-b p-6">
        <h1 className="text-lg font-bold text-primary">Applicant Portal</h1>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {user?.name || 'Applicant'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {applicantLinks.map(({ to, label, icon: Icon }) => (
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
