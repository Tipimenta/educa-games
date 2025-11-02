import { useLocalStorageBoolean } from '../hooks/useLocalStorage';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout({ user, onLogout, children, containerClassName }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useLocalStorageBoolean(
    'sidebarCollapsed',
    true
  );

  const offsetClass = isSidebarCollapsed ? 'lg:ml-12' : 'lg:ml-48';

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        user={user}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onLogout={onLogout}
      />
      <div className="flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
          userRole={user?.role}
        />
        <div
          className={`flex flex-1 flex-col transition-[margin] duration-300 ease-in-out ${offsetClass}`}
        >
          <main className="flex-grow p-6 pt-16">
            <div
              className={`mx-auto w-full ${containerClassName || 'max-w-6xl'} ${
                containerClassName === 'max-w-full' ? 'px-0' : 'px-4 sm:px-6 lg:px-8'
              }`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
