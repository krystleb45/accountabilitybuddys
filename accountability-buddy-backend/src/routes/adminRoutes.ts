import express, { Router, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import logger from "../utils/winstonLogger";
import {
  getAllUsers,
  updateUserRole,
  deleteUserAccount,
} from "../controllers/AdminController";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";

// Explicitly define the router type
const router: Router = express.Router();

// Middleware to ensure only admins can access these routes
const isAdmin = roleBasedAccessControl(["admin"]);

/**
 * Utility function to handle route errors consistently
 */
const handleRouteErrors = (
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error occurred: ${(error as Error).message}`);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (Admin only)
 * @access  Private
 */
router.get(
  "/users",
  authMiddleware, // Ensure JWT auth is validated
  isAdmin, // Role-based access control
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response) => {
    const users = await getAllUsers(req, res); // Pass validated request
    res.status(200).json({ success: true, data: users });
  })
);

/**
 * @route   PATCH /api/admin/users/role
 * @desc    Update a user's role (Admin only)
 * @access  Private
 */
router.patch(
  "/users/role",
  [
    authMiddleware, // Validate JWT
    isAdmin, // Ensure only admins can proceed
    check("userId", "User ID is required and must be valid").notEmpty().isMongoId(),
    check("role", "Role is required").notEmpty().isString(),
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Update user role
    const result = await updateUserRole(req, res);
    res.status(200).json({ success: true, data: result });
  })
);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete a user account (Admin only)
 * @access  Private
 */
router.delete(
  "/users/:userId",
  [authMiddleware, isAdmin],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response) => {
    // Delete user account
    await deleteUserAccount(req, res);

    // Log and respond
    logger.info(`User account deleted. UserID: ${req.params.userId}`);
    res.status(200).json({ success: true, msg: "User account deleted successfully" });
  })
);

export default router;
