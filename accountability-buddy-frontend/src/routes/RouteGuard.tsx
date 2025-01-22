import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/context/auth/AuthContext'; // Ensure the correct path to AuthContext

interface RouteGuardProps {
  element: JSX.Element;
  isPrivate?: boolean;
  redirectPath?: string; // Custom redirect path for unauthenticated users
}

/**
 * RouteGuard Component
 *
 * This component guards routes based on authentication status.
 *
 * @param {RouteGuardProps} props - The props containing route details and access requirements.
 * @returns {JSX.Element} - The guarded element or a redirect.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({
  element,
  isPrivate = false,
  redirectPath = '/login',
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isPrivate && !isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return element;
};

export default RouteGuard;
