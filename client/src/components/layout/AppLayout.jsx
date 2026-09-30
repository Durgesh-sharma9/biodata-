import { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { getMySchool } from '@/lib/api';
import { 
  Menu, 
  X, 
  Building2, 
  Bell, 
  LogOut, 
  QrCode
} from 'lucide-react';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { SchoolQRModal } from '@/components/common/SchoolQRModal';

export function AppLayout() {
  const { school: authSchool, user, logout, isSuperAdmin, isApplicant } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Always keep school data in sync with React Query
  const { data: mySchoolData } = useQuery({
    queryKey: ['mySchool'],
    queryFn: () => getMySchool().then((r) => r.data.data),
    enabled: !isSuperAdmin && !isApplicant,
    staleTime: 30000,
  });

  const school = mySchoolData || authSchool;
  const schoolName = school?.schoolName || 'WellFair International School';
  const schoolAddress = [school?.address, school?.city].filter(Boolean).join(', ') || 'Jaisinghpura bhankrota jaipur';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-slate-950 antialiased selection:bg-[#8A3BD4]/15 selection:text-[#8A3BD4]">
      {/* Desktop Sidebar Panel */}
      <div className="hidden md:block w-64 shrink-0 relative z-30 h-full no-print">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex no-print">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setMobileNavOpen(false)} 
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="absolute top-3.5 right-3.5 z-20">
              <button 
                onClick={() => setMobileNavOpen(false)} 
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <Sidebar onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header Bar (h-14 aligned with Sidebar header) */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E2EAE7] dark:border-slate-800/60 bg-white dark:bg-slate-900 px-3 sm:px-5 z-20 shadow-2xs gap-2 sm:gap-4 no-print">
          {/* Left: Mobile Hamburger & School Brand (Matches Reference: Logo + Name + Address) */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-[#8A3BD4] hover:border-[#8A3BD4]/40 hover:bg-purple-50/50 transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
              aria-label="Open navigation"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* School Logo + Name + Address (Reference Design) */}
            {!isSuperAdmin && !isApplicant && school ? (
              <Link
                to="/school-profile"
                className="flex items-center gap-2.5 sm:gap-3 group min-w-0 py-0.5"
                title="View / Edit School Profile"
              >
                <div className="h-9 w-9 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center p-1 shadow-2xs shrink-0 overflow-hidden group-hover:border-[#8A3BD4]/40 transition-colors">
                  {school.logoUrl ? (
                    <img
                      src={school.logoUrl}
                      alt={schoolName}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-4.5 h-4.5 text-[#8A3BD4]" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-extrabold text-[13px] sm:text-[13.5px] text-slate-900 dark:text-white truncate group-hover:text-[#8A3BD4] transition-colors">
                    {schoolName}
                  </span>
                  {schoolAddress && (
                    <span className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 truncate font-medium mt-0.5 max-w-[200px] sm:max-w-[320px] lg:max-w-[440px]">
                      {schoolAddress}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <Link to="/" className="flex items-center gap-2 shrink-0 group">
                <img
                  src="/hirehub-logo-transparent.png"
                  alt="HireHub Logo"
                  className="h-7.5 w-7.5 object-contain shrink-0 group-hover:scale-105 transition-transform"
                />
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  Hire<span className="text-[#8A3BD4]">Hub</span>
                </span>
              </Link>
            )}

            {/* Global Search Bar (Desktop) */}
            <div className="hidden lg:block flex-1 max-w-xs xl:max-w-sm min-w-0 ml-auto mr-1">
              <GlobalSearch />
            </div>
          </div>

          {/* Right: Actions Cluster (Search on mobile/tablet, Notifications, School QR, Logout) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Search Icon Button for screens where full bar is hidden */}
            <div className="lg:hidden">
              <GlobalSearch triggerVariant="icon" />
            </div>

            {/* Notification Bell Button */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="h-9 w-9 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#8A3BD4] hover:bg-purple-50/50 hover:border-purple-200 shadow-2xs transition-all relative cursor-pointer active:scale-95"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>

              {/* Notification Popover - Empty State */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                    <span className="text-[10px] text-slate-400 font-medium">0 new</span>
                  </div>
                  <div className="py-6 text-center text-slate-400">
                    <Bell className="h-6 w-6 mx-auto mb-1.5 opacity-30 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No new notifications</p>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">You're all caught up!</p>
                  </div>
                </div>
              )}
            </div>

            {/* School Application QR Button */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="h-9 w-9 sm:h-9 sm:w-auto p-0 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-[#8A3BD4] hover:border-[#8A3BD4]/40 hover:bg-purple-50/50 font-bold text-xs transition-all shadow-2xs group cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
              title="Open School Application QR Code for Walk-In Candidates"
            >
              <QrCode className="w-4 h-4 text-[#8A3BD4] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden sm:inline">School QR</span>
            </button>

            {/* Logout Button (in place of old school profile card on the right) */}
            <button
              type="button"
              onClick={logout}
              className="h-9 px-2.5 sm:px-3 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:border-rose-900/50 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs transition-all shadow-2xs group cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 transition-colors" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        
        {/* Main scrollable page container */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 printable-area">
          <div className="w-full max-w-[1400px] mx-auto space-y-5">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Navbar School QR Popup Modal */}
      {!isSuperAdmin && !isApplicant && (
        <SchoolQRModal 
          isOpen={qrModalOpen} 
          onClose={() => setQrModalOpen(false)} 
          school={school} 
        />
      )}
    </div>
  );
}