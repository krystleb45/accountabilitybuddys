import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import roleBasedAccessControl from "../middleware/roleBasedAccessControl"; // Corrected RBAC middleware import path
import * as RewardController from "../controllers/RewardController"; // Corrected controller import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Logger utility

const router = express.Router();

/**
 * Middleware for handling validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rewards = await RewardController.getUserRewards(req.user?.id);
      res.status(200).json({ success: true, rewards });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching rewards: ${errorMessage}`);
      next(error); // Pass error to global error handler
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rewardId } = req.body;
      const result = await RewardController.redeemReward(req.user?.id, rewardId);
      res.status(200).json({ success: true, message: "Reward redeemed successfully.", result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error redeeming reward: ${errorMessage}`);
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
    check("description").optional().isString().withMessage("Description must be a string."),
    check("points").isNumeric().withMessage("Points must be a numeric value."),
  ],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, points } = req.body;
      const newReward = await RewardController.createReward({ title, description, points });
      res.status(201).json({ success: true, message: "Reward created successfully.", newReward });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error creating reward: ${errorMessage}`);
      next(error);
    }
  }
);

export default router;
