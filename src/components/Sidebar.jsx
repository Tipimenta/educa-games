import { NavLink } from 'react-router-dom';

import PlusLogo from '../assets/+.svg?url';
import FullLogo from '../assets/+EducaGames.svg?url';
import { ROLES } from '../constants';
import {
  BarChartIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MegaphoneIcon,
  UsersIcon,
} from './Icons';

const Sidebar = ({ isCollapsed, onMouseEnter, onMouseLeave, userRole, onLinkClick = () => {} }) => {
  return (
    <aside
      className={`bg-primary fixed top-0 left-0 z-30 flex h-full flex-col overflow-hidden text-white transition-all duration-300 ease-in-out ${
        isCollapsed
          ? 'w-0 -translate-x-full md:w-12 md:translate-x-0'
          : 'w-72 translate-x-0 md:w-60 lg:w-52'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="relative flex h-16 items-center justify-center bg-white">
        {isCollapsed ? (
          <img src={PlusLogo} alt="Logo compacta" className="h-5" />
        ) : (
          <img src={FullLogo} alt="EducaGames" className="h-4" />
        )}
      </div>
      <nav className="pt-2 pb-4">
        <ul className="space-y-2">
          {userRole === ROLES.STUDENT && (
            <>
              <li>
                  <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Dashboard"
                >
                  <LayoutDashboardIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Dashboard
                  </span>
                </NavLink>
              </li>
              <li>
                  <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Cursos"
                >
                  <BookOpenIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Cursos
                  </span>
                </NavLink>
              </li>
            </>
          )}

          {userRole === ROLES.INSTRUCTOR && (
            <>
              <li>
                <NavLink
                  to="/instructor/manage-courses"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Cursos"
                >
                  <LibraryIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Cursos
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/instructor/manage-content"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Módulos"
                >
                  <BookOpenIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Módulos
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/instructor/manage-classes"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Turmas"
                >
                  <UsersIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Turmas
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/instructor/reports"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Demonstrativo"
                >
                  <BarChartIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Demonstrativo
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/instructor/manage-announcements"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Avisos"
                >
                  <MegaphoneIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Avisos
                  </span>
                </NavLink>
              </li>
            </>
          )}

          {userRole === ROLES.ADMIN && (
            <>
              <li>
                <NavLink
                  to="/admin/manage-instructors"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                  onClick={onLinkClick}
                  aria-label="Instrutores"
                >
                  <UsersIcon className="text-secondary mr-3 h-5 w-5 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    Instrutores
                  </span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
