import express, { Request, Response, NextFunction } from "express";
import { check, query, validationResult } from "express-validator";
import Gamification from "../models/Gamification"; // Corrected model import path
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Added logger utility

const router = express.Router();

/**
 * Rate limiter to prevent excessive requests to the leaderboard
 */
const leaderboardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 leaderboard requests per minute
  message: "Too many requests, please try again later",
});

/**
 * Middleware to handle validation errors
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
 * @route   GET /gamification/leaderboard
 * @desc    Get leaderboard with optional pagination
 * @access  Private
 */
router.get(
  "/leaderboard",
  authMiddleware,
  leaderboardLimiter,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    try {
      const leaderboard = await Gamification.find()
        .sort({ level: -1, points: -1 }) // Sort by level, then points
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "name email"); // Populate user data

      const totalUsers = await Gamification.countDocuments();

      res.status(200).json({
        success: true,
        data: leaderboard,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
        },
      });
    } catch (error) {
      logger.error(`Error fetching leaderboard: ${(error as Error).message}`, { error });
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }
);

/**
 * Rate limiter for adding points
 */
const addPointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests. Please try again later.",
});

/**
 * @route   POST /gamification/add-points
 * @desc    Add points to a user's gamification profile
 * @access  Private
 */
router.post(
  "/add-points",
  authMiddleware,
  addPointsLimiter,
  [
    check("userId", "User ID is required and must be valid").notEmpty().isMongoId(),
    check("points", "Points must be a positive integer").isInt({ min: 1 }),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    const { userId, points } = req.body;

    try {
      const userGamification = await Gamification.findOne({ userId });

      if (!userGamification) {
        return res.status(404).json({
          success: false,
          message: "User not found in gamification system",
        });
      }

      // Add points and update level
      await userGamification.addPoints(points);

      res.status(200).json({
        success: true,
        message: `Added ${points} points to user ${userId}`,
      });
    } catch (error) {
      logger.error(`Error adding points: ${(error as Error).message}`, { error });
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  }
);

export default router;