import React from 'react';

const DashboardCard = ({ icon, title, value }) => (
  <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-md">
    <div className="rounded-full bg-blue-100 p-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DashboardCard;
