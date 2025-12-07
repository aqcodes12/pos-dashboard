import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { showInfoToast } from "./toastConfig";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    showInfoToast("Please login to continue");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
