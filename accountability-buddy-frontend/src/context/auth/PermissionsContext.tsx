// PermissionsContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Define the shape of the PermissionsContext
interface PermissionsContextType {
  permissions: string[];
  roles: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  setUserPermissions: (perms: string[]) => void;
  setUserRoles: (userRoles: string[]) => void;
  canAccess: (requiredRoles?: string[], requiredPermissions?: string[]) => boolean;
  resetPermissionsAndRoles: () => void; // Reset function
}

// Create PermissionsContext with the appropriate type
const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Custom hook to use PermissionsContext
export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

// PermissionsProvider component props
interface PermissionsProviderProps {
  children: ReactNode;
}

// Permissions Provider component
export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  // Check if a user has a specific permission
  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  // Check if a user has a specific role
  const hasRole = useCallback((role: string) => roles.includes(role), [roles]);

  // Set user permissions
  const setUserPermissions = useCallback((perms: string[]) => {
    if (Array.isArray(perms)) {
      setPermissions(perms);
    } else {
      console.error("Permissions should be an array");
    }
  }, []);

  // Set user roles
  const setUserRoles = useCallback((userRoles: string[]) => {
    if (Array.isArray(userRoles)) {
      setRoles(userRoles);
    } else {
      console.error("Roles should be an array");
    }
  }, []);

  // Reset permissions and roles
  const resetPermissionsAndRoles = useCallback(() => {
    setPermissions([]);
    setRoles([]);
  }, []);

  // Check if the user has both roles and permissions for an action
  const canAccess = useCallback(
    (requiredRoles: string[] = [], requiredPermissions: string[] = []) => {
      const hasRequiredRoles = requiredRoles.every((role) => hasRole(role));
      const hasRequiredPermissions = requiredPermissions.every((perm) =>
        hasPermission(perm)
      );
      return hasRequiredRoles && hasRequiredPermissions;
    },
    [hasRole, hasPermission]
  );

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        roles,
        hasPermission,
        hasRole,
        setUserPermissions,
        setUserRoles,
        canAccess,
        resetPermissionsAndRoles,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;
