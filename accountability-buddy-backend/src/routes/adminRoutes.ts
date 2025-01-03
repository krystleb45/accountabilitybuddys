import express, { Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import logger from "../utils/winstonLogger";
import {
  getAllUsers,
  updateUserRole,
  deleteUserAccount,
} from "../controllers/AdminController";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";

const router = express.Router();

// Middleware to ensure only admins can access these routes
const isAdmin = roleBasedAccessControl(["admin"]);

/**
 * Utility function to handle route errors consistently
 */
const handleRouteErrors = (
  handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error occurred: ${(error as Error).message}`);
      next(error);
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
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const users = await getAllUsers(req, res, next);
    res.json({ success: true, data: users });
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
    authMiddleware,
    isAdmin,
    check("userId", "User ID is required and must be valid").notEmpty().isMongoId(),
    check("role", "Role is required").notEmpty().isString(),
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const result = await updateUserRole(req, res, next);
    res.json({ success: true, data: result });
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
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await deleteUserAccount(req, res, next);

    logger.info(`User account deleted. UserID: ${req.params.userId}`);
    res.json({ success: true, msg: "User account deleted successfully" });
  })
);

export default router;
