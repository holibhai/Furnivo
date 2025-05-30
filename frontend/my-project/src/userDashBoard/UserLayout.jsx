// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
const UserLayout = () => {
  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex flex-col flex-1">
        <UserHeader />
        <div className="p-4 bg-gray-100 overflow-y-auto  h-full pl-72 pt-24">
           
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
