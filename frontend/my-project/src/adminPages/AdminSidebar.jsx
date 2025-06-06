import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  List,
  Settings,
  LogOut,
  UserCog,
  User,
  BarChart3,
  Truck,
  ClipboardMinus,
  Star,
   PersonStanding,
    Archive
} from "lucide-react";
import logo from "../assets/Cream_and_Brown_Minimalist_Furniture_Logo-removebg-preview (1).png"


const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-neutral-400 h-full  text-center fixed shadow-xl z-50 flex flex-col p-4 space-y-4">
      <h2 className="">
        <img src={logo} alt="" className="w-[200px] -mb-12 -mt-14" />
      </h2>

      <NavLink
        to="/admin"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink
        to="/admin/displayProducts"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <PackagePlus size={18} /> Products
      </NavLink>

      <NavLink
        to="/admin/catagory"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <List size={18} /> Product Category
      </NavLink>

      <NavLink
        to="/admin/displayOrders"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        < Archive size={18} /> Orders
      </NavLink>

      <NavLink
        to="/admin/deliverycost"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <Truck size={18} /> Delivery Cost
      </NavLink>

      <NavLink
        to="/admin/displayAdmin"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <UserCog size={18} /> Admins
      </NavLink>

      <NavLink
        to="/admin/customers"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <User size={18} /> Customers
      </NavLink>

      <NavLink
        to="/admin/reports"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <ClipboardMinus size={18} /> Reports
      </NavLink>

      <NavLink
        to="/admin/reviewAdmin"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <Star size={18} /> Review
      </NavLink>
       <NavLink
        to="/admin/profile"
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
      >
        <PersonStanding size={18} /> Profile
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

export default AdminSidebar;