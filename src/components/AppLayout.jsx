import { useLocalStorageBoolean } from '../hooks/useLocalStorage';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout({ user, onLogout, children, containerClassName }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useLocalStorageBoolean(
    'sidebarCollapsed',
    true
  );

  const offsetClass = isSidebarCollapsed ? 'md:ml-12' : 'md:ml-60 lg:ml-52';

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        user={user}
        toggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onLogout={onLogout}
      />
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}
      <div className="flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
          onLinkClick={() => {
            const isMobile = window.matchMedia('(max-width: 767px)').matches;
            if (isMobile) {
              setSidebarCollapsed(true);
            }
          }}
          userRole={user?.role?.toLowerCase()}
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
