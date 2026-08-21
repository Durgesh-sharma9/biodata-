import { Outlet } from 'react-router-dom';
import { ApplicantSidebar } from './ApplicantSidebar';

export function ApplicantLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f3f4] dark:bg-slate-950 antialiased selection:bg-[#A05AFF]/10 selection:text-[#A05AFF]">
      {/* Applicant Workspace Left Navigation Panel */}
      <div className="hidden md:block w-64 shrink-0 relative z-30 h-full">
        <ApplicantSidebar />
      </div>

      {/* Primary Workspace Viewport Container Grid */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden relative">
        {/* Main Application Inner Canvas Shell */}
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