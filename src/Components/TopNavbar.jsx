import React from 'react';
import { useSelector } from "react-redux";
import image from "../images/user.png";
import ThemeToggle from "../lib/ThemeToggle";
import { Link } from 'react-router-dom';

function TopNavbar() {
  const { Authuser } = useSelector((state) => state.auth);
  console.log("Authuser in TopNavbar:", Authuser);

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur-md bg-base-100/80 border-b border-base-300 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              {Authuser?.name || "Guest"}
            </span>
          </h1>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* User Profile Info */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/ManagerDashboard/Profilepage" 
              className="relative group focus:outline-none"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <img
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-base-100"
                  src={Authuser?.ProfilePic || image}
                  alt="Profile"
                />
              </div>
            </Link> 

            <div className="hidden sm:block text-left">
              <h1 className="text-sm font-semibold leading-none text-base-content">
                {Authuser?.name || "Guest"}
              </h1>
              <p className="mt-1 text-xs opacity-60 capitalize font-medium">
                {Authuser?.role || "Visitor"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-base-300"></div>

          {/* Theme Switcher Wrapper */}
          <div className="p-1.5 rounded-xl bg-base-200/60 hover:bg-base-200 transition-colors">
            <ThemeToggle className="text-base-content opacity-80 hover:opacity-100 text-lg cursor-pointer" />
          </div>

        </div>
      </nav>
    </div>
  );
}

export default TopNavbar;