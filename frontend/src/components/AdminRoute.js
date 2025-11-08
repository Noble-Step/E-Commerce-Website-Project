import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Admin Route
const AdminRoute = ({ children }) => {
  const { user } = useUser();

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
