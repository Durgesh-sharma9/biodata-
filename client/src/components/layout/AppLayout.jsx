import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export function AppLayout() {
  const { school, isSuperAdmin, isApplicant } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/60 to-indigo-50/20 antialiased selection:bg-indigo-500/10 selection:text-indigo-600">
      {/* Sidebar Navigation Panel Container */}
      <div className="hidden md:block shrink-0 relative z-30">
        <Sidebar />
      </div>

      {/* Main Panel Content Track Grid */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        {/* Subtle Ambient Background Flare Dots for Premium Depth */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-cyan-400/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

        {!isSuperAdmin && !isApplicant && school?.credits != null && (
          <header className="flex h-16 items-center justify-end border-b border-slate-200/50 bg-white/70 backdrop-blur-md px-6 sm:px-8 shadow-sm shadow-slate-100/40 sticky top-0 z-20">
            <Badge 
              variant="secondary" 
              className="text-xs sm:text-sm font-bold tracking-wide px-3.5 py-1.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-100/50 text-indigo-700 shadow-sm shadow-indigo-500/5 animate-in fade-in-0 duration-500"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2" />
              Credits Matrix: <span className="font-extrabold ml-1 text-indigo-900">{school.credits}</span>
            </Badge>
          </header>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {/* Inner Content Safe-Frame Guard */}
          <div className="mx-auto max-w-7xl w-full h-full animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}