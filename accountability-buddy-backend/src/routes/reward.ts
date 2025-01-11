import express, { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl"; // Corrected RBAC middleware import path
import * as RewardController from "../controllers/RewardController"; // Corrected controller import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Logger utility

const router: Router = express.Router();

/**
 * Middleware for handling validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return response directly to fix the error
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next(); // Continue to the next middleware if no errors
};


/**
 * Rate limiter to prevent abuse.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per IP
  message: "Too many requests. Please try again later.",
});

/**
 * @route   GET /rewards
 * @desc    Get user rewards
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Pass req, res, and next to properly handle async operations in the controller
      await RewardController.getUserRewards(req, res, next);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching rewards for user ${req.user?.id}: ${errorMessage}`);
      next(error); // Pass error to middleware
    }
  }
);

/**
 * @route   POST /rewards/redeem
 * @desc    Redeem a reward
 * @access  Private
 */
router.post(
  "/redeem",
  authMiddleware,
  rateLimiter,
  [check("rewardId").notEmpty().withMessage("Reward ID is required.")],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Pass req, res, and next directly to the controller function
      await RewardController.redeemReward(req, res, next);

      res.status(200).json({
        success: true,
        message: "Reward redeemed successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error redeeming reward for user ${req.user?.id}: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   POST /rewards/create
 * @desc    Create a new reward (Admin only)
 * @access  Private (Admin only)
 */
router.post(
  "/create",
  authMiddleware,
  roleBasedAccessControl(["admin"]),
  [
    check("title").notEmpty().withMessage("Title is required."),
    check("description")
      .optional()
      .isString()
      .withMessage("Description must be a string."),
    check("points")
      .isNumeric()
      .withMessage("Points must be a numeric value."),
  ],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Pass req, res, and next directly to the controller function
      await RewardController.createReward(req, res, next);

      res.status(201).json({
        success: true,
        message: "Reward created successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error creating reward: ${errorMessage}`);
      next(error);
    }
  }
);

export default router;
