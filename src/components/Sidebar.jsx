import { NavLink } from 'react-router-dom';

import PlusLogo from '../assets/+.svg';
import FullLogo from '../assets/+EducaGames.svg';
import { ROLES } from '../constants';
import {
  BarChartIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MegaphoneIcon,
  UsersIcon,
} from './Icons';

const Sidebar = ({ isCollapsed, onMouseEnter, onMouseLeave, userRole }) => {
  return (
    <aside
      className={`bg-primary fixed top-0 left-0 z-30 flex h-full flex-col text-white overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-48'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative flex h-16 items-center justify-center bg-white">
        {isCollapsed ? (
          <img src={PlusLogo} alt="Logo compacta" className="h-5" />
        ) : (
          <img src={FullLogo} alt="EducaGames" className="h-4" />
        )}
      </div>
      <nav className="flex-grow pt-0">
        <ul>
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
                >
                  <LayoutDashboardIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
                >
                  <BookOpenIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
                  to="/admin/manage-courses"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <LibraryIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
                  to="/admin/manage-content"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <BookOpenIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
                  to="/admin/manage-classes"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <UsersIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
                  to="/admin/reports"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <BarChartIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
                  to="/admin/manage-announcements"
                  className={({ isActive }) =>
                    `flex items-center py-2 pl-4 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <MegaphoneIcon className="text-secondary h-5 w-5 mr-3 flex-shrink-0" />
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
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
