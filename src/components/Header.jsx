import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { LogOutIcon, MenuIcon } from '../components';
import { AuthContext } from '../context';
import { ROLES } from '../constants';

const Header = ({ user, toggleSidebar, onLogout, leftPaddingClass = '' }) => {
  const { openClassSelection } = useContext(AuthContext);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileRef]);

  const handleLogout = () => {
    onLogout();
  };

  const initial = user?.role === 'instructor' ? 'I' : user?.name?.charAt(0).toUpperCase() || 'U';
  
  // Verifica se é estudante com múltiplas turmas
  const isStudent = user?.role?.toLowerCase() === ROLES.STUDENT;
  const hasMultipleClasses = user?.classes && Array.isArray(user.classes) && user.classes.length > 1;
  const currentClassName = user?.classes?.find((c) => c.id === user?.classId)?.className;

  let leftClass = 'left-0';
  if (leftPaddingClass) {
    const classes = leftPaddingClass.split(' ');
    const convertedClasses = classes.map((cls) => {
      if (cls.startsWith('md:ml-')) {
        const value = cls.replace('md:ml-', '');
        return `md:left-${value}`;
      }
      if (cls.startsWith('lg:ml-')) {
        const value = cls.replace('lg:ml-', '');
        return `lg:left-${value}`;
      }
      return cls;
    });
    leftClass = `left-0 ${convertedClasses.join(' ')}`;
  }

  return (
    <header
      className={`fixed top-0 right-0 z-20 flex h-16 items-center justify-between bg-white px-6 shadow-sm transition-[left] duration-300 ease-in-out ${leftClass}`}
    >
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-800 md:hidden"
        aria-label="Abrir/Fechar menu"
        aria-expanded="false"
      >
        <MenuIcon />
      </button>
      <div className="flex-1"></div>
      {isStudent && hasMultipleClasses && currentClassName && (
        <button
          onClick={openClassSelection}
          className="mr-2 md:mr-4 flex items-center gap-1 md:gap-2 rounded-lg border border-gray-300 bg-white px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span className="hidden md:inline text-xs text-gray-500">Você está visualizando a turma:</span>
          <span className="font-semibold text-blue-600">{currentClassName}</span>
        </button>
      )}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2"
          aria-label="Menu do perfil"
          aria-expanded={isProfileOpen}
        >
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${initial}`}
            alt="Foto do usuário"
          />
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-xl">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
              Meu Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
            >
              <LogOutIcon className="mr-2" />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
