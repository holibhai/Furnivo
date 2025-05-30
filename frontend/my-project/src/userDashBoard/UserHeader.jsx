import React from "react";
import {
  Bell,
  LogOut,
  Settings,
  UserCircle,
  Menu,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserHeader = () => {
  const navigate=useNavigate();

  const handleClick=()=>{
      localStorage.removeItem('token');
      navigate("/");
  }
  return (
    <header className="fixed w-full top-0 left-0 z-40 bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Menu className="text-gray-600 cursor-pointer" size={24} />
        {/* <h1 className="text-2xl font-semibold text-gray-700 pl-64">Admin Dashboard</h1> */}
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <Bell className="text-gray-600 hover:text-yellow-500 cursor-pointer" size={22} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
            3
          </span>
        </div>

        {/* Settings */}
        <Link to="/">
        <Home className="text-gray-600 hover:text-blue-500 cursor-pointer" size={22} />

        </Link>

        {/* Profile Image */}
        <img
          src="https://i.pravatar.cc/40"
          alt="admin-profile"
          className="w-9 h-9 rounded-full border-2 border-yellow-400 object-cover shadow-md"
        />

        {/* Logout Button */}
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition"
        onClick={handleClick}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default UserHeader;
