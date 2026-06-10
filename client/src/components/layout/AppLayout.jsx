import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export function AppLayout() {
  const { school, isSuperAdmin, isApplicant } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {!isSuperAdmin && !isApplicant && school?.credits != null && (
          <header className="flex items-center justify-end border-b bg-card px-6 py-3">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Credits: {school.credits}
            </Badge>
          </header>
        )}
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
