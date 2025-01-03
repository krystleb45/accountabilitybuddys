import React, { createContext, useContext, useState, useCallback } from 'react';

// Create Permissions Context
const PermissionsContext = createContext();

// Custom hook to use PermissionsContext
export const usePermissions = () => useContext(PermissionsContext);

// Permissions Provider component
export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);

  // Check if a user has a specific permission
  const hasPermission = useCallback(
    (permission) => permissions.includes(permission),
    [permissions]
  );

  // Check if a user has a specific role
  const hasRole = useCallback(
    (role) => roles.includes(role),
    [roles]
  );

  // Set user permissions
  const setUserPermissions = useCallback((perms) => {
    if (Array.isArray(perms)) {
      setPermissions(perms);
    } else {
      console.error('Permissions should be an array');
    }
  }, []);

  // Set user roles
  const setUserRoles = useCallback((userRoles) => {
    if (Array.isArray(userRoles)) {
      setRoles(userRoles);
    } else {
      console.error('Roles should be an array');
    }
  }, []);

  // Check if the user has both roles and permissions for an action
  const canAccess = useCallback(
    (requiredRoles = [], requiredPermissions = []) => {
      const hasRequiredRoles = requiredRoles.every((role) => hasRole(role));
      const hasRequiredPermissions = requiredPermissions.every((perm) => hasPermission(perm));
      return hasRequiredRoles && hasRequiredPermissions;
    },
    [hasRole, hasPermission]
  );

  return (
    <PermissionsContext.Provider
      value={{ permissions, roles, hasPermission, hasRole, setUserPermissions, setUserRoles, canAccess }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;
