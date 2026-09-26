import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Briefcase, Coins } from 'lucide-react';

export function AppLayout() {
  const { school, isSuperAdmin, isApplicant } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9fc] dark:bg-slate-950 antialiased selection:bg-[#A05AFF]/15 selection:text-[#A05AFF]">
      {/* Desktop Sidebar Panel */}
      <div className="hidden md:block w-64 shrink-0 relative z-30 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
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
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900 px-4 sm:px-6 z-20 shadow-xs">
          {/* Left: Mobile Hamburger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#A05AFF] hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#A05AFF] to-[#7928CA] flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Hire<span className="text-[#A05AFF]">Hub</span>
              </span>
            </div>
          </div>

          {/* Right: Credits Badge & School Name */}
          <div className="flex items-center gap-3">
            {!isSuperAdmin && !isApplicant && school && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                  {school.schoolName}
                </span>
                {school.credits != null && (
                  <Link to="/credits">
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-bold px-3 py-1 rounded-xl border border-[#A05AFF]/30 bg-[#A05AFF]/10 text-[#A05AFF] hover:bg-[#A05AFF]/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{school.credits}</span>
                      <span className="hidden sm:inline font-semibold text-[10px] opacity-80">Credits</span>
                    </Badge>
                  </Link>
                )}
              </div>
            )}
          </div>
        </header>
        
        {/* Main scrollable page container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}