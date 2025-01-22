import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  isAuthenticated: boolean;
  element: JSX.Element;
  redirectPath?: string; // Optional redirect path for authenticated users
}

/**
 * PublicRoute Component
 *
 * This component restricts access to public routes for authenticated users.
 * If the user is authenticated, they are redirected to the specified path (default is "/").
 * Otherwise, the provided element is rendered.
 *
 * @param {PublicRouteProps} props - The props containing authentication state, the element to render, and an optional redirect path.
 * @returns {JSX.Element} - The rendered element or a redirect.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({
  isAuthenticated,
  element,
  redirectPath = '/',
}) => {
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return element;
};

export default PublicRoute;
