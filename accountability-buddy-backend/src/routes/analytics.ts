import express, { Response, NextFunction } from "express";
import { check, query, validationResult } from "express-validator";
import goalAnalyticsController from "../controllers/goalAnalyticsController";
import authMiddleware, {
  AuthenticatedRequest,
} from "../middleware/authMiddleware";
import logger from "../utils/winstonLogger";

const router = express.Router();

/**
 * Utility function to handle route errors consistently
 */
const handleRouteErrors = (
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
): ((
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error occurred: ${(error as Error).message}`);
      next(error);
    }
  };
};

/**
 * @route   GET /api/analytics/goals
 * @desc    Get general goal analytics
 * @access  Private
 */
router.get(
  "/goals",
  authMiddleware,
  handleRouteErrors(
    async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      // Pass the `req`, `res`, and `next` to the controller
      const analytics = await goalAnalyticsController.getUserGoalAnalytics(
        req,
        res,
        next
      );
      res.json({ success: true, data: analytics });
    }
  )
);

/**
 * @route   GET /api/analytics/goals/:id
 * @desc    Get analytics for a specific goal by ID
 * @access  Private
 */
router.get(
  "/goals/:id",
  [
    authMiddleware,
    check("id", "Goal ID is invalid").isMongoId(), // Validate the goal ID format
  ],
  handleRouteErrors(
    async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
        res.status(400).json({ success: false, errors: errors.array() });
        return; // Explicit return to avoid executing further code
      }

      // Pass `req`, `res`, and `next` explicitly to the controller
      const analytics = await goalAnalyticsController.getGoalAnalyticsById(
        req,
        res,
        next
      );
      res.json({ success: true, data: analytics });
    }
  )
);

/**
 * @route   GET /api/analytics/goals/date-range
 * @desc    Get analytics for goals by date range
 * @access  Private
 */
router.get(
  "/goals/date-range",
  [
    authMiddleware,
    query("startDate")
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Invalid start date format")
      .toDate(),
    query("endDate")
      .notEmpty()
      .withMessage("End date is required")
      .isISO8601()
      .withMessage("Invalid end date format")
      .toDate(),
  ],
  handleRouteErrors(
    async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn(`Validation error: ${JSON.stringify(errors.array())}`);
        res.status(400).json({ success: false, errors: errors.array() });
        return; // Explicit return to prevent further execution
      }

      // Call the controller directly with req, res, and next
      const analytics = await goalAnalyticsController.getGoalAnalyticsById(
        req, // Pass `req` explicitly
        res, // Pass `res` explicitly
        next // Pass `next` explicitly
      );

      res.json({ success: true, data: analytics });
    }
  )
);


export default router;
