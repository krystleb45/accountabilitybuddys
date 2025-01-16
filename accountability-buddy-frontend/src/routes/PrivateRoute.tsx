import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, element }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
