import React from 'react';

import { LogoPlaceholderIcon } from '../components/Icons';

const AuthLayout = ({ children }) => (
  <div className="font-roboto flex min-h-screen flex-col md:flex-row">
    <div className="hidden flex-1 items-center justify-center bg-white p-12 md:flex">
      <div className="w-full max-w-md text-center">
        <LogoPlaceholderIcon />
      </div>
    </div>

    <div className="bg-primary flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white md:hidden">
          <h1 className="font-sigmar text-4xl font-bold">+EducaGames</h1>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
