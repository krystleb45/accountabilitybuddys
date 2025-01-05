import express, { Router, Response, NextFunction, RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import logger from "../utils/winstonLogger";
import * as AdminController from "../controllers/AdminController";
import * as AnalyticsController from "../controllers/AnalyticsController";

// Explicitly define the router type
const router: Router = express.Router();

// Middleware to check admin role
const isAdmin: RequestHandler = roleBasedAccessControl(["admin"]);



// Rate limiter to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow 10 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

/**
 * Unified Error Handler for Routes
 */
const handleRouteErrors = (
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    handler(req as AuthenticatedRequest, res, next).catch((error) => {
      logger.error(`Error occurred: ${(error as Error).message}`);
      res.status(500).json({ success: false, message: "Internal server error" });
    });
  };
};

/**
 * @route GET /api/admin/analytics/users
 * @desc Fetch user analytics
 * @access Private - Admin only
 */
router.get(
  "/users",
  authMiddleware as unknown as RequestHandler,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const analytics = await AdminController.getUserAnalytics(req as AuthenticatedRequest, res, next);
    res.status(200).json({ success: true, data: analytics });
  }) as unknown as RequestHandler // <-- Ensure compatibility with Express types
);

/**
 * @route GET /api/admin/analytics/goals
 * @desc Fetch goal analytics
 * @access Private - Admin only
 */
router.get(
  "/goals",
  authMiddleware as unknown as RequestHandler,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const analytics = await AnalyticsController.getGlobalAnalytics(req as AuthenticatedRequest, res, next);
    res.status(200).json({ success: true, data: analytics });
  }) as unknown as RequestHandler
);

/**
 * @route GET /api/admin/analytics/posts
 * @desc Fetch post analytics
 * @access Private - Admin only
 */
router.get(
  "/posts",
  authMiddleware as unknown as RequestHandler,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const analytics = await AnalyticsController.getGlobalAnalytics(req as AuthenticatedRequest, res, next);
    res.status(200).json({ success: true, data: analytics });
  }) as unknown as RequestHandler
);

/**
 * @route GET /api/admin/analytics/financial
 * @desc Fetch financial analytics
 * @access Private - Admin only
 */
router.get(
  "/financial",
  authMiddleware as unknown as RequestHandler,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const analytics = await AdminController.getFinancialAnalytics(req as AuthenticatedRequest, res, next);
    res.status(200).json({ success: true, data: analytics });
  }) as unknown as RequestHandler
);

/**
 * @route POST /api/admin/analytics/custom
 * @desc Fetch custom analytics based on date range and metric
 * @access Private - Admin only
 */
router.post(
  "/custom",
  [
    authMiddleware as unknown as RequestHandler,
    isAdmin,
    rateLimiter,
    check("startDate")
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Invalid date format"),
    check("endDate")
      .notEmpty()
      .withMessage("End date is required")
      .isISO8601()
      .withMessage("Invalid date format"),
    check("metric")
      .notEmpty()
      .withMessage("Metric is required")
      .isString()
      .withMessage("Metric must be a string"),
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { startDate, endDate, metric } = req.body;
    const analytics = await AnalyticsController.getCustomAnalytics(
      startDate,
      endDate,
      metric
    );
    res.status(200).json({ success: true, data: analytics });
  }) as unknown as RequestHandler
);

export default router;
