import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export function AppLayout() {
  const { school, isSuperAdmin, isApplicant } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f3f4] dark:bg-slate-950 antialiased selection:bg-[#A05AFF]/10 selection:text-[#A05AFF]">
      {/* Sidebar Navigation Panel Container */}
      <div className="hidden md:block w-64 shrink-0 relative z-30 h-full">
        <Sidebar />
      </div>

      {/* Main Panel Content Track Grid */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden relative">
        {!isSuperAdmin && !isApplicant && school?.credits != null && (
          <header className="flex h-14 shrink-0 items-center justify-end border-b border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 px-5 sm:px-6 z-20 shadow-sm">
            <Badge 
              variant="secondary" 
              className="text-xs font-bold tracking-wide px-3 py-1 rounded-xl border border-[#A05AFF]/30 bg-[#A05AFF]/5 text-[#A05AFF] shadow-none transition-all duration-300"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#A05AFF] mr-2" />
              CREDITS MATRIX: <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">{school.credits}</span>
            </Badge>
          </header>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Inner Content Safe-Frame Guard - 100% Uniform Across All Pages */}
          <div className="w-full max-w-[1400px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}