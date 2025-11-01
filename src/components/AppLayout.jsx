import { useState } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout({ user, onLogout, children }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const offsetClass = isSidebarCollapsed ? 'lg:ml-12' : 'lg:ml-48';

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        user={user}
        toggleSidebar={() => {
          const next = !isSidebarCollapsed;
          setSidebarCollapsed(next);
          localStorage.setItem('sidebarCollapsed', String(next));
        }}
        onLogout={onLogout}
      />
      <div className="flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onMouseEnter={() => {
            setSidebarCollapsed(false);
            localStorage.setItem('sidebarCollapsed', 'false');
          }}
          onMouseLeave={() => {
            setSidebarCollapsed(true);
            localStorage.setItem('sidebarCollapsed', 'true');
          }}
          userRole={user?.role}
        />
        <div
          className={`flex flex-1 flex-col transition-[margin] duration-300 ease-in-out ${offsetClass}`}
        >
          <main className="flex-grow p-6 pt-16">{children}</main>
        </div>
      </div>
    </div>
  );
}
