import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../images/logo1.png";

function Navbar() {
  return (
    <header className="bg-base-100 border-b border-base-300 sticky top-0 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-3.5 px-4 sm:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 focus:outline-hidden">
          <img
            src={logo1}
            className="w-40 sm:w-48 h-auto object-contain"
            alt="InventoryPro Logo"
          />
        </Link>

        {/* Call To Action Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/LoginPage"
            className="px-4 sm:px-5 py-2 bg-base-200 hover:bg-base-300 text-base-content text-xs sm:text-sm font-medium rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/SignupPage"
            className="px-4 sm:px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-xs"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;