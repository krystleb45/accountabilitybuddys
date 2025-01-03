import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import AuditLog from "../models/AuditLog";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import logger from "../utils/winstonLogger";

const router = express.Router();

// Middleware to ensure only admins can access audit logs
const isAdmin = roleBasedAccessControl(["admin"]);

/**
 * Utility function to handle errors in routes
 */
const handleRouteErrors = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error occurred: ${(error as Error).message}`);
      next(error);
    }
  };
};

/**
 * @route   GET /api/audit/logs
 * @desc    Get all audit logs (Admin only)
 * @access  Private (Admin only)
 */
router.get(
  "/logs",
  [authMiddleware, isAdmin],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const logs = await AuditLog.find().sort({ createdAt: -1 });

    if (!logs.length) {
      logger.warn(`No audit logs found. Admin: ${req.user?.id}, IP: ${req.ip}`);
      res.status(404).json({ success: false, msg: "No audit logs found" });
      return; // FIXED: Added explicit return
    }

    logger.info(`Admin ${req.user?.id} accessed audit logs. IP: ${req.ip}`);
    res.json({ success: true, data: logs });
  })
);

/**
 * @route   GET /api/audit/logs/:userId
 * @desc    Get audit logs for a specific user (Admin only)
 * @access  Private (Admin only)
 */
router.get(
  "/logs/:userId",
  [
    authMiddleware,
    isAdmin,
    check("userId", "Invalid User ID format").isMongoId(),
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error for userId: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ success: false, errors: errors.array() });
      return; // FIXED: Added explicit return
    }

    const { userId } = req.params;
    const userLogs = await AuditLog.find({ userId }).sort({ createdAt: -1 });

    if (!userLogs.length) {
      logger.warn(`No audit logs found for user: ${userId}`);
      res.status(404).json({ success: false, msg: "No audit logs found for this user" });
      return; // FIXED: Added explicit return
    }

    logger.info(
      `Admin ${req.user?.id} accessed audit logs for user: ${userId}. IP: ${req.ip}`
    );
    res.json({ success: true, data: userLogs });
  })
);

export default router;
