import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';  // Optional loading spinner component

const PrivateRoute = ({ element, requiredRoles }) => {
  const { authToken, loading, user } = useContext(AuthContext); // Get token, loading, and user from context
  const location = useLocation();  // Get current location for redirection after login

  // Show a loading spinner if authentication status is still being determined
  if (loading) {
    return <LoadingSpinner aria-label="Loading, please wait" />;
  }

  // If no token, redirect to login and preserve the current route in state
  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access if required
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and no role restriction issues, render the element
  return element;
};

// Prop validation
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

PrivateRoute.defaultProps = {
  requiredRoles: null,  // No specific roles required by default
};

export default PrivateRoute;
