import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import * as goalMessageController from "../controllers/GoalMessageController"; // Corrected controller import path
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Added logger utility

const router = express.Router();

/**
 * Rate limiter to prevent excessive message sending.
 */
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // Limit to 30 messages per minute per user
  message: "Too many messages sent, please try again later.",
});

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @route   POST /goal-message/:goalId/send
 * @desc    Send a message related to a specific goal
 * @access  Private
 */
router.post(
  "/:goalId/send",
  authMiddleware,
  messageLimiter,
  [
    check("message", "Message is required").notEmpty(),
    check("message", "Message must not exceed 500 characters").isLength({
      max: 500,
    }),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { goalId } = req.params;

    // Validate goalId format
    if (!goalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid goal ID" });
    }

    try {
      await goalMessageController.sendGoalMessage(req, res);
    } catch (error) {
      logger.error(`Error sending goal message: ${(error as Error).message}`, {
        error,
        goalId,
        userId: req.user?.id,
      });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   GET /goal-message/:goalId/messages
 * @desc    Retrieve all messages related to a specific goal
 * @access  Private
 */
router.get(
  "/:goalId/messages",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { goalId } = req.params;

    // Validate goalId format
    if (!goalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid goal ID" });
    }

    try {
      await goalMessageController.getGoalMessages(req, res);
    } catch (error) {
      logger.error(`Error fetching goal messages: ${(error as Error).message}`, {
        error,
        goalId,
        userId: req.user?.id,
      });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

export default router;
