import React from 'react';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

function StaffDashboard() {
  return (
    <div className="flex bg-base-100 text-base-content min-h-screen transition-colors duration-300">
      
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pl-64 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  );
}

export default StaffDashboard;
