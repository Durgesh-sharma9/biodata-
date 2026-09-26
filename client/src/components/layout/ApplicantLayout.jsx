import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ApplicantSidebar } from './ApplicantSidebar';
import { Menu, X, Briefcase, GraduationCap } from 'lucide-react';

export function ApplicantLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9fc] dark:bg-slate-950 antialiased selection:bg-[#A05AFF]/15 selection:text-[#A05AFF]">
      {/* Desktop Navigation */}
      <div className="hidden md:block w-64 shrink-0 relative z-30 h-full">
        <ApplicantSidebar />
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
              <ApplicantSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Primary Workspace Viewport Container */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900 px-4 z-20 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#A05AFF] hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1BCFB4] to-[#16b39c] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Hire<span className="text-[#A05AFF]">Hub</span> Candidate
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}