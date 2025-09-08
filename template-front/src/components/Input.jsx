import React from 'react';

const Input = ({ type = 'text', placeholder, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
    {...props}
  />
);

export default Input;
