import { Request, Response, NextFunction } from "express-serve-static-core";
import { AuthenticatedRequest } from "../middleware/authMiddleware"; // Assuming AuthenticatedRequest is defined elsewhere
import logger from "../utils/winstonLogger";

/**
 * Middleware for Role-Based Access Control
 * @param allowedRoles - Array of allowed roles
 */
export const roleBasedAccessControl = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = (req as AuthenticatedRequest).user?.role;

      if (!userRole) {
        logger.warn("Access Denied: No role assigned to the user.");
        res.status(403).json({
          success: false,
          message: "Access Denied: No role assigned to the user.",
        });
        return;
      }

      if (!allowedRoles.includes(userRole)) {
        logger.warn(`Access Denied: Role '${userRole}' is not authorized.`);
        res.status(403).json({
          success: false,
          message: `Access Denied: Role '${userRole}' is not authorized.`,
        });
        return;
      }

      next();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(`RBAC Middleware Error: ${errorMessage}`);
      res.status(500).json({
        success: false,
        message: "An internal error occurred during authorization.",
      });
    }
  };
};
