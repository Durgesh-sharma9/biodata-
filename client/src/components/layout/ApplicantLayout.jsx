import { Outlet } from 'react-router-dom';
import { ApplicantSidebar } from './ApplicantSidebar';

export function ApplicantLayout() {
  return (
    <div className="flex min-h-screen">
      <ApplicantSidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
