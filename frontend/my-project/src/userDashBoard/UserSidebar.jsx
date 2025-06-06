import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../assets/Cream_and_Brown_Minimalist_Furniture_Logo-removebg-preview (1).png"


const UserSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-neutral-400 h-screen fixed shadow-xl z-50 flex flex-col p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4 tracking-wide text-white">
        <img src={logo} alt="" className="-mb-20 -mt-16" />
      </h2>

      <NavLink
        to="/user"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink
        to="/user/userOrderDisplay"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <List size={18} /> Orders
      </NavLink>

      <NavLink
        to="/user/review"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <Star size={18} /> Review
      </NavLink>

      <NavLink
        to="/user/settings"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <Settings size={18} /> Settings
      </NavLink>

      <NavLink
        to="/logout"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500 hover:text-white transition mt-auto"
      >
        <LogOut size={18} /> Logout
      </NavLink>
    </div>
  );
};

export default UserSidebar;
