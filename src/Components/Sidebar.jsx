import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';

import { AiOutlineProduct } from "react-icons/ai";
import { RiStockLine } from "react-icons/ri";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { MdOutlinePointOfSale, MdOutlineCategory } from "react-icons/md";
import { TfiSupport } from "react-icons/tfi";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxActivityLog, RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";

import { logout } from "../features/authSlice";
import logo1 from '../images/logo1.png';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Authuser } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const getRolePrefix = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/AdminDashboard';
      case 'staff':
        return '/StaffDashboard';
      case 'manager':
      default:
        return '/ManagerDashboard';
    }
  };

  const rolePrefix = getRolePrefix(Authuser?.role);

  const navItems = [
    {
      title: "Product",
      path: `${rolePrefix}/product`,
      icon: AiOutlineProduct,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: "Activity Log",
      path: `${rolePrefix}/activity-log`,
      icon: RxActivityLog,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: "Supplier",
      path: `${rolePrefix}/supplier`,
      icon: TfiSupport,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: "Sales",
      path: `${rolePrefix}/sales`,
      icon: MdOutlinePointOfSale,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: "Order",
      path: `${rolePrefix}/order`,
      icon: FiShoppingCart,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: "Stock Transaction",
      path: `${rolePrefix}/stock-transaction`,
      icon: RiStockLine,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: Authuser?.role === "admin" ? "Create Notifications" : "Notifications",
      path: Authuser?.role === "admin" ? `${rolePrefix}/notifications` : `${rolePrefix}/NotificationPageRead`,
      icon: IoNotificationsOutline,
      roles: ["manager", "admin", "staff"]
    },
    {
      title: "Category",
      path: `${rolePrefix}/category`,
      icon: MdOutlineCategory,
      roles: ["manager", "admin"]
    },
    {
      title: "Users",
      path: `${rolePrefix}/Userstatus`,
      icon: LuUsers,
      roles: ["manager"]
    }
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(Authuser?.role?.toLowerCase())
  );

  return (
    <aside className="flex flex-col w-64 h-screen sticky top-0 bg-base-100 border-r border-base-300 text-base-content p-5 transition-colors duration-300">
      
      {/* Brand / Logo (Pinned Top) */}
      <div className="flex justify-center items-center py-2 mb-4 shrink-0">
        <img 
          src={logo1} 
          className="w-44 h-auto object-contain p-2 rounded-lg bg-base-200/50" 
          alt="Company Logo" 
        />
      </div>

      {/* Navigation Links (Scrollable area) */}
      <nav className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1">
        
        <NavLink
          to={rolePrefix}
          end
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-content shadow-xs"
                : "opacity-80 hover:opacity-100 hover:bg-base-200"
            }`
          }
        >
          <RxDashboard className="text-lg shrink-0" />
          <span>Dashboard</span>
        </NavLink>

        <div className="my-2 border-t border-base-300/60" />

        {filteredNavItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-content shadow-xs"
                    : "opacity-80 hover:opacity-100 hover:bg-base-200"
                }`
              }
            >
              <Icon className="text-lg shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout (Pinned Bottom) */}
      <div className="pt-3 mt-auto border-t border-base-300 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm text-error hover:bg-error/10 transition-colors duration-200 focus:outline-hidden cursor-pointer"
        >
          <FiLogOut className="text-lg shrink-0" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;