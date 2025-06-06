// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <div className="p-4 bg-gray-200 overflow-y-auto  h-full pl-72 pt-24">
           <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
