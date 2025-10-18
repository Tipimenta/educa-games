import { NavLink } from 'react-router-dom';

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
      className={`bg-primary fixed top-0 left-0 z-30 flex h-full flex-col text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative flex h-16 items-center justify-center bg-white">
        <h1
          className={`font-sigmar flex items-center justify-center text-center text-2xl font-bold transition-opacity duration-200 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className={`text-secondary text-4xl font-bold`}>+</span>
          <span className={`text-primary`}>Educa</span>
          <span className={`text-secondary`}>Games</span>
        </h1>
        <h1
          className={`font-sigmar absolute text-4xl font-bold transition-opacity duration-200 ${
            isCollapsed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className={`text-secondary text-4xl font-bold`}>+</span>
        </h1>
      </div>
      <nav className="flex-grow pt-4">
        <ul>
          {userRole === 'aluno' && (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <LayoutDashboardIcon
                    className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`}
                  />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <BookOpenIcon
                    className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`}
                  />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Cursos</span>
                </NavLink>
              </li>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <li>
                <NavLink
                  to="/admin/courses"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <LibraryIcon
                    className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`}
                  />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Cursos</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/content"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <BookOpenIcon
                    className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`}
                  />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Módulos</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/classes"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <UsersIcon className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`} />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Turmas</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <BarChartIcon
                    className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`}
                  />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Relatórios</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/announcements"
                  className={({ isActive }) =>
                    `flex items-center py-3 transition-colors duration-200 ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <MegaphoneIcon
                    className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`}
                  />
                  <span className={isCollapsed ? 'hidden' : 'inline'}>Avisos</span>
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
