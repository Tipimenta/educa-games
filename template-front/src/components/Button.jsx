import React from 'react';

const Button = ({ children, type = 'button', onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-primary w-full rounded-lg py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
  >
    {children}
  </button>
);

export default Button;
