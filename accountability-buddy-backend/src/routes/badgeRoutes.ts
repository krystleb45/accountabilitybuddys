import express, { Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import * as badgeController from "../controllers/BadgeController";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import logger from "../utils/winstonLogger";

const router = express.Router();

// Middleware to ensure only admins can access specific routes
const adminMiddleware = roleBasedAccessControl(["admin"]);

// Rate limiter to prevent abuse of badge routes
const badgeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});

// Apply rate limiter to all badge routes
router.use(badgeRateLimiter);

// Middleware for input validation
const validateBadgeData = [
  check("userId").optional().isMongoId().withMessage("Invalid User ID"),
  check("badgeType").notEmpty().withMessage("Badge type is required"),
  check("level")
    .optional()
    .isIn(["Bronze", "Silver", "Gold"])
    .withMessage("Invalid badge level"),
  check("increment")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Increment must be a positive integer"),
];

// Custom function to validate and handle errors
const handleValidationErrors = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return; // Explicit return for void type
  }
  next();
};

/**
 * Utility function to handle route errors
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
      logger.error(`Error in badge route: ${(error as Error).message}`);
      next(error);
    }
  };
};

/**
 * @route   GET /badges
 * @desc    Get all badges for the logged-in user
 * @access  Private
 */
router.get(
  "/badges",
  authMiddleware,
  handleRouteErrors(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      await badgeController.getUserBadges(req, res, next); // Pass all 3 arguments
    }
  )
);


/**
 * @route   GET /badges/showcase
 * @desc    Get showcased badges for the logged-in user
 * @access  Private
 */
router.get(
  "/badges/showcase",
  authMiddleware,
  handleRouteErrors(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      await badgeController.getUserBadgeShowcase(req, res, next); // Pass all 3 arguments
    }
  )
);


/**
 * @route   POST /badges/award
 * @desc    Award a badge to a user
 * @access  Private (Admin only)
 */
router.post(
  "/badges/award",
  [authMiddleware, adminMiddleware, ...validateBadgeData, handleValidationErrors],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await badgeController.awardBadge(req, res, next);
  })
);


/**
 * @route   POST /badges/progress/update
 * @desc    Update badge progress for the logged-in user
 * @access  Private
 */
router.post(
  "/badges/progress/update",
  [authMiddleware, ...validateBadgeData, handleValidationErrors], // Spread validation
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await badgeController.updateBadgeProgress(req, res, next); // Pass full req, res, next
  })
);


/**
 * @route   POST /badges/upgrade
 * @desc    Upgrade a badge level for the logged-in user
 * @access  Private
 */
router.post(
  "/badges/upgrade",
  [authMiddleware, ...validateBadgeData, handleValidationErrors], // Spread validateBadgeData
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await badgeController.upgradeBadgeLevel(req, res, next); // Pass req, res, next directly
  })
);



/**
 * @route   DELETE /badges/expired/remove
 * @desc    Remove expired badges for a user
 * @access  Private (Admin only)
 */
router.delete(
  "/badges/expired/remove",
  [authMiddleware, adminMiddleware],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await badgeController.removeExpiredBadges(req, res, next); // Pass req, res, and next
  })
);


export default router;
