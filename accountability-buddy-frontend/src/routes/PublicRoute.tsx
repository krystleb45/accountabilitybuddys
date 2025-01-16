import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  isAuthenticated: boolean;
  element: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ isAuthenticated, element }) => {
  return isAuthenticated ? <Navigate to="/" /> : element;
};

export default PublicRoute;
