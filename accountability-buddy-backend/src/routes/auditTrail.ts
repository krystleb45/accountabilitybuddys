import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import AuditTrail from "../models/AuditTrail";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import logger from "../utils/winstonLogger";

const router = express.Router();

// Middleware to ensure only admins or auditors can access audit trails
const isAdminOrAuditor = roleBasedAccessControl(["admin", "auditor"]);

// Utility function for consistent error handling
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
 * @route   GET /api/audit-trail
 * @desc    Get all audit trails (Admin or Auditor only)
 * @access  Private
 */
router.get(
  "/",
  [authMiddleware, isAdminOrAuditor],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const trails = await AuditTrail.find().sort({ createdAt: -1 });

    if (!trails.length) {
      logger.warn(`No audit trails found. Accessed by: ${req.user?.id}, IP: ${req.ip}`);
      res.status(404).json({ success: false, msg: "No audit trails found" });
      return; // FIXED: Explicit return to satisfy void type
    }

    logger.info(`Audit trails accessed by: ${req.user?.id}, IP: ${req.ip}`);
    res.json({ success: true, data: trails });
  })
);

/**
 * @route   GET /api/audit-trail/:userId
 * @desc    Get audit trails for a specific user (Admin or Auditor only)
 * @access  Private
 */
router.get(
  "/:userId",
  [
    authMiddleware,
    isAdminOrAuditor,
    check("userId", "Invalid User ID format").isMongoId(),
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error for userId: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ success: false, errors: errors.array() });
      return; // FIXED: Explicit return to satisfy void type
    }

    const { userId } = req.params;
    const userTrails = await AuditTrail.find({ userId }).sort({ createdAt: -1 });

    if (!userTrails.length) {
      logger.warn(`No audit trails found for user: ${userId}`);
      res.status(404).json({ success: false, msg: "No audit trails found for this user" });
      return; // FIXED: Explicit return to satisfy void type
    }

    logger.info(
      `Audit trails for user ${userId} accessed by: ${req.user?.id}, IP: ${req.ip}`
    );
    res.json({ success: true, data: userTrails });
  })
);

/**
 * @route   DELETE /api/audit-trail/:trailId
 * @desc    Delete a specific audit trail entry (Admin only)
 * @access  Private
 */
router.delete(
  "/:trailId",
  [
    authMiddleware,
    roleBasedAccessControl(["admin"]),
    check("trailId", "Invalid Trail ID format").isMongoId(),
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation error for trailId: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ success: false, errors: errors.array() });
      return; // FIXED: Explicit return to satisfy void type
    }

    const { trailId } = req.params;
    const trail = await AuditTrail.findById(trailId);

    if (!trail) {
      logger.warn(`Audit trail not found for ID: ${trailId}`);
      res.status(404).json({ success: false, msg: "Audit trail not found" });
      return; // FIXED: Explicit return to satisfy void type
    }

    await AuditTrail.deleteOne({ _id: trailId }); // FIXED: Replaced .remove() with deleteOne() since remove() is deprecated
    logger.info(`Audit trail with ID: ${trailId} deleted by Admin: ${req.user?.id}, IP: ${req.ip}`);
    res.json({ success: true, msg: "Audit trail deleted successfully" });
  })
);

export default router;
