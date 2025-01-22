import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  element: JSX.Element;
  redirectPath?: string; // Optional redirect path
}

/**
 * PrivateRoute Component
 *
 * This component restricts access to routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page
 * or a custom redirect path.
 *
 * @param {PrivateRouteProps} props - The props containing authentication state, the element to render, and an optional redirect path.
 * @returns {JSX.Element} - The rendered element or a redirect.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  element,
  redirectPath = "/login",
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
