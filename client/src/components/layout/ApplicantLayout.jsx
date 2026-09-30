import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApplicantSidebar } from './ApplicantSidebar';
import { useAuth } from '@/context/AuthContext';
import { getApplicantDashboard } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  X,
  Briefcase,
  GraduationCap,
  Bell,
  Inbox,
  CreditCard,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

export function ApplicantLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch applicant dashboard data for navbar indicators
  const { data: dashData } = useQuery({
    queryKey: ['applicant-dashboard'],
    queryFn: () => getApplicantDashboard().then((r) => r.data.data),
    staleTime: 30000,
  });

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/applicant/profile')) return 'My Candidate Profile';
    if (p.includes('/applicant/documents')) return 'My Documents';
    if (p.includes('/applicant/requests')) return 'Received School Requests';
    if (p.includes('/applicant/plan')) return 'My Subscription & Plans';
    if (p.includes('/applicant/notifications')) return 'Notifications';
    return 'Candidate Dashboard';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F7F6] dark:bg-slate-950 antialiased selection:bg-[#0F766E]/20 selection:text-[#0F766E]">
      {/* Desktop Sidebar (Soft Light Modern Style) */}
      <div className="hidden md:block w-64 shrink-0 relative z-30 h-full">
        <ApplicantSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
            <div className="absolute top-4 right-3 z-20">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full overflow-y-auto" onClick={() => setMobileNavOpen(false)}>
              <ApplicantSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 z-20 shadow-xs">
          
          {/* Left: Mobile Toggle & Page Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Hire<span className="text-blue-600">Hub</span>
              </span>
            </div>

            {/* Desktop Breadcrumb / Title */}
            <div className="hidden md:flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Portal
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {getPageTitle()}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ml-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Talent Pool Active
              </span>
            </div>
          </div>

          {/* Right: Actions, Badges & Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Plan / Credits Badge */}
            <Link to="/applicant/plan" className="group">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 transition-all cursor-pointer shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold truncate max-w-[120px]">
                  {dashData?.hasActivePlan ? 'Premium Plan' : (user?.activePlan || 'Free Plan')}
                </span>
                {(dashData?.requestCredits != null && dashData.requestCredits > 0) && (
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[10px] font-black">
                    {dashData.requestCredits} cr
                  </span>
                )}
              </div>
            </Link>

            {/* Received Requests Shortcut Icon */}
            <Link
              to="/applicant/requests"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Received School Requests"
            >
              <Inbox className="w-4 h-4" />
              {(dashData?.requestCount != null && dashData.requestCount > 0) && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">
                  {dashData.requestCount}
                </span>
              )}
            </Link>

            {/* Notifications Shortcut Icon */}
            <Link
              to="/applicant/notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {(dashData?.unreadNotifications != null && dashData.unreadNotifications > 0) && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </Link>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all select-none"
              >
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
                    {user?.name || 'Candidate'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 leading-none">
                    Applicant
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {user?.name || 'Candidate'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {user?.email || ''}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/applicant/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/applicant/plan"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                      <span>My Plan & Credits</span>
                    </Link>
                    <Link
                      to="/applicant/requests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Inbox className="w-3.5 h-3.5 text-cyan-600" />
                      <span>School Requests</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main scrollable workspace with soft, comfortable light background */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc] dark:bg-slate-950">
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}