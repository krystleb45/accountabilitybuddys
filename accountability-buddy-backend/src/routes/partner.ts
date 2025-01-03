import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware";
import * as partnerController from "../controllers/partnerController";
import logger from "../utils/winstonLogger"; // Use your logger here

const router = express.Router();

const validatePartnerInput = [
  check("partnerId", "Partner ID is required and must be a valid Mongo ID").notEmpty().isMongoId(),
  check("goal", "Goal title is required").notEmpty(),
  check("milestone", "Milestone title is required").notEmpty(),
];

const validateAddPartnerInput = [
  check("partnerId", "Partner ID is required and must be a valid Mongo ID").notEmpty().isMongoId(),
  check("userId", "User ID is required and must be a valid Mongo ID").notEmpty().isMongoId(),
];

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per window
  message: "Too many requests. Please try again later.",
});

router.post(
  "/notify",
  authMiddleware,
  rateLimiter,
  validatePartnerInput,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { partnerId, goal, milestone } = sanitize(req.body);

      await partnerController.notifyPartner(req.user.id, partnerId, goal, milestone);

      res.status(200).json({ success: true, message: "Partner notified successfully" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      logger.error(`Error notifying partner: ${errorMessage}`);
      res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
  }
);

router.post(
  "/add",
  authMiddleware,
  rateLimiter,
  validateAddPartnerInput,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { partnerId, userId } = sanitize(req.body);

      await partnerController.addPartnerNotification(req.user.id, partnerId, userId);

      res.status(200).json({ success: true, message: "Partner added and notified successfully" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      logger.error(`Error adding partner: ${errorMessage}`);
      res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
  }
);

router.get(
  "/notifications",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const notifications = await partnerController.getPartnerNotifications(req.user.id);

      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ success: false, message: "No partner notifications found" });
      }

      res.status(200).json({ success: true, notifications });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      logger.error(`Error fetching notifications: ${errorMessage}`);
      res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
  }
);

export default router;
