import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LogOutIcon, MenuIcon } from '../components/Icons';

const Header = ({ toggleSidebar }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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
   
    


    navigate('/login');
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between bg-white px-6 shadow-sm">
      <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 lg:hidden">
        <MenuIcon />
      </button>
      <div className="flex-1"></div> 
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2"
        >
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://placehold.co/100x100/E2E8F0/4A5568?text=M"
            alt="Foto do usuário"
          />
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-xl">
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
              Configurações
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
