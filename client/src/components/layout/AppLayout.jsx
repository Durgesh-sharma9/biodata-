import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { getMySchool } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Briefcase, Coins, Building2, QrCode } from 'lucide-react';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { SchoolQRModal } from '@/components/common/SchoolQRModal';

export function AppLayout() {
  const { school: authSchool, isSuperAdmin, isApplicant } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Always keep school data in sync with React Query
  const { data: mySchoolData } = useQuery({
    queryKey: ['mySchool'],
    queryFn: () => getMySchool().then((r) => r.data.data),
    enabled: !isSuperAdmin && !isApplicant,
    staleTime: 30000,
  });

  const school = mySchoolData || authSchool;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F7F6] dark:bg-slate-950 antialiased selection:bg-[#0F766E]/15 selection:text-[#0F766E]">
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
                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
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
        {/* Top Header Bar - Clean & Mobile-Optimized */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E2EAE7] dark:border-slate-800/60 bg-white dark:bg-slate-900 px-3 sm:px-5 z-20 shadow-2xs gap-2 sm:gap-4 no-print">
          {/* Left: Mobile Hamburger & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-[#0F766E] hover:border-[#0F766E]/40 hover:bg-teal-50/50 transition-all shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            
            <div className="flex md:hidden items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] flex items-center justify-center text-white shadow-2xs">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Hire<span className="text-[#0F766E]">Hub</span>
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar (Desktop only, md and above) */}
          <div className="hidden md:block flex-1 max-w-md mx-4 min-w-0">
            <GlobalSearch />
          </div>

          {/* Right: Actions Cluster (Search icon on mobile, QR Code button, School profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Icon Button */}
            <div className="md:hidden">
              <GlobalSearch triggerVariant="icon" />
            </div>

            {!isSuperAdmin && !isApplicant && school && (
              <>
                {/* Instant School QR Button */}
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="h-9 w-9 sm:h-9 sm:w-auto p-0 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-[#0F766E] hover:border-[#0F766E]/40 hover:bg-teal-50/50 font-bold text-xs transition-all shadow-2xs group cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  title="Open School Application QR Code for Walk-In Candidates"
                >
                  <QrCode className="w-4 h-4 text-[#0F766E] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="hidden sm:inline">School QR</span>
                </button>

                {/* School Name & Logo Link */}
                <Link
                  to="/school-profile"
                  className="h-9 w-9 sm:h-auto sm:w-auto p-0 sm:px-2 sm:py-1 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-teal-50/50 hover:border-[#0F766E]/40 transition-all group shadow-2xs flex items-center justify-center gap-2 active:scale-95"
                  title="View / Edit School Profile"
                >
                  <div className="h-6 w-6 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {school.logoUrl ? (
                      <img
                        src={school.logoUrl}
                        alt={school.schoolName}
                        className="h-full w-full object-contain p-0.5"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-tr from-[#0F766E]/15 to-[#14B8A6]/15 text-[#0F766E] flex items-center justify-center font-bold text-[10px]">
                        {school.schoolName ? school.schoolName.charAt(0).toUpperCase() : <Building2 className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-tight max-w-[120px] md:max-w-[200px]">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0F766E] transition-colors">
                      {school.schoolName}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 truncate">
                      School Portal
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </header>
        
        {/* Main scrollable page container - Compact spacing on mobile */}
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