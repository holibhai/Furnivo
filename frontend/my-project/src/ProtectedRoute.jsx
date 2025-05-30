// src/routes/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const role = localStorage.getItem("role"); // Example: "ADMIN" or "USER"
  const location = useLocation();

  if (!role) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    alert("Unauthorized access. You do not have permission to view this page.");
    // Optional: Redirect to specific dashboard if role is valid but not allowed for this route
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "USER") return <Navigate to="/user" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
