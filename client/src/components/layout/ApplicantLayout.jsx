import { Outlet } from 'react-router-dom';
import { ApplicantSidebar } from './ApplicantSidebar';

export function ApplicantLayout() {
  return (
    <div className="flex min-h-screen bg-[#f3f3f4] dark:bg-slate-950 antialiased selection:bg-[#A05AFF]/10 selection:text-[#A05AFF]">
      {/* Applicant Workspace Left Navigation Panel */}
      <div className="hidden md:block shrink-0 relative z-30">
        <ApplicantSidebar />
      </div>

      {/* Primary Workspace Viewport Container Grid */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        {/* Main Application Inner Canvas Shell */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-6">
          {/* Inner Content Safe-Frame Guard */}
          <div className="mx-auto max-w-[1400px] w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}