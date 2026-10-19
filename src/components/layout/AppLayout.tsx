import { Outlet, useLocation } from 'react-router-dom';
import { MessageSquareText } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const { pathname } = useLocation();
  const role = pathname === '/' ? 'CS / Ops' : 'Sales';

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar role={role} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <button className="fab" aria-label="Mở trợ lý AI">
        <MessageSquareText size={20} />
      </button>
    </div>
  );
}
