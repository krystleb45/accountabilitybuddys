import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware"; // Ensure this is correctly defined

/**
 * Middleware for Role-Based Access Control
 * @param allowedRoles - Array of allowed roles
 */
export const roleBasedAccessControl = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = (req as AuthenticatedRequest).user?.role;

      if (!userRole) {
        res.status(403).json({ message: "Access denied: No role assigned." });
        return; // Ensure no further execution
      }

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({ message: "Access denied: Insufficient permissions." });
        return; // Ensure no further execution
      }

      next(); // Proceed to the next middleware
    } catch (error: unknown) {
      if (error instanceof Error) {
        next({
          status: 500,
          message: "Internal server error.",
          error: error.message,
        });
      } else {
        next({
          status: 500,
          message: "An unknown error occurred.",
        });
      }
    }
  };
};
