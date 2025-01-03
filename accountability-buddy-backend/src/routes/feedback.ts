import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import * as feedbackController from "../controllers/FeedbackController";
import authMiddleware from "../middleware/authMiddleware";
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger";

const router = express.Router();

/**
 * Rate limiter to prevent spam in feedback submissions.
 */
const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 feedback submissions per hour
  message: "Too many feedback submissions, please try again later",
});

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @route   POST /feedback
 * @desc    Submit feedback
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  feedbackLimiter,
  [
    check("message", "Feedback message is required").notEmpty().isLength({ max: 1000 }),
    check("type", "Invalid feedback type").isIn(["bug", "feature-request", "other"]),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await feedbackController.submitFeedback(req, res);
    } catch (error) {
      logger.error(`Error submitting feedback: ${(error as Error).message}`, { error });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   GET /feedback
 * @desc    Get feedback submitted by the authenticated user
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await feedbackController.getUserFeedback(req, res);
    } catch (error) {
      logger.error(`Error fetching feedback: ${(error as Error).message}`, { error });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   DELETE /feedback/:feedbackId
 * @desc    Delete feedback by ID
 * @access  Private
 */
router.delete(
  "/:feedbackId",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { feedbackId } = req.params;

    // Validate feedback ID format
    if (!feedbackId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid feedback ID" });
    }

    try {
      await feedbackController.deleteFeedback(req, res);
    } catch (error) {
      logger.error(`Error deleting feedback: ${(error as Error).message}`, { error });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

export default router;
