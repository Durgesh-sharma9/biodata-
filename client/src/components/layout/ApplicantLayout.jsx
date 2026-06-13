import { Outlet } from 'react-router-dom';
import { ApplicantSidebar } from './ApplicantSidebar';

export function ApplicantLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/70 to-blue-50/30 antialiased selection:bg-indigo-500/10 selection:text-indigo-600">
      {/* Applicant Workspace Left Navigation Panel */}
      <div className="hidden md:block shrink-0 relative z-30">
        <ApplicantSidebar />
      </div>

      {/* Primary Workspace Viewport Container Grid */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        {/* Soft Fluid Mesh Flares behind Applicant Workflow Panels */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/5 via-indigo-400/5 to-transparent rounded-full filter blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

        {/* Main Application Inner Canvas Shell */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {/* Inner Content Safe-Frame Guard & Entrance Transition */}
          <div className="mx-auto max-w-7xl w-full h-full animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}