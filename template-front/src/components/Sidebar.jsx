import React from 'react';
import { NavLink } from 'react-router-dom';

// Corrigido o caminho de importação para a estrutura de pastas correta
import { LayoutDashboardIcon, SettingsIcon } from '../components/Icons';

const Sidebar = ({ isCollapsed, onMouseEnter, onMouseLeave }) => {
  return (
    <aside
      className={`bg-primary fixed top-0 left-0 z-30 flex h-full flex-col text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative flex h-16 items-center justify-center bg-white">
        {/* O nome completo da logo, que aparece quando o menu está expandido */}
        <h1
          className={`font-sigmar flex items-center justify-center text-center text-2xl font-bold transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
        >
          <span className={`text-secondary text-4xl font-bold`}>+</span>
          <span className={`text-primary`}>Educa</span>
          <span className={`text-secondary`}>Games</span>
        </h1>

        {/* O ícone '+', que aparece quando o menu está recolhido */}
        <h1
          className={`font-sigmar absolute text-4xl font-bold transition-opacity duration-200 ${isCollapsed ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className={`text-secondary text-4xl font-bold`}>+</span>
        </h1>
      </div>
      <nav className="flex-grow pt-4">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center py-3 transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
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
              to="/settings"
              className={({ isActive }) =>
                `flex items-center py-3 transition-colors duration-200 ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              }
            >
              <SettingsIcon className={`text-secondary mx-auto ${!isCollapsed && 'mr-3 ml-6'}`} />
              <span className={isCollapsed ? 'hidden' : 'inline'}>Configurações</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
