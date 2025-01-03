import React from "react";
import { Navigate, useLocation } from "react-router-dom"; // Use Navigate instead of Redirect
import { useAuth } from "../context/AuthContext"; // Correctly import your custom hook

interface PrivateRouteProps {
  element: JSX.Element;
  requiredRoles?: string[]; // If you're using roles
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredRoles }) => {
  const { isAuthenticated, loading, user } = useAuth(); // Use the custom hook to get token, loading, and user
  const location = useLocation(); // Get current location for redirection after login

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading indicator
  }

  return isAuthenticated ? (
    element // Render the element if authenticated
  ) : (
    <Navigate to="/login" state={{ from: location }} replace /> // Redirect to login if not authenticated
  );
};

export default PrivateRoute;
