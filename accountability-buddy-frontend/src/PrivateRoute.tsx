import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) => {
  const location = useLocation();

  // If authenticated, render children; otherwise, navigate to login
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
