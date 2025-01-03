import express, { Response, NextFunction, Request } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import logger from "../utils/winstonLogger";
import * as AdminController from "../controllers/AdminController";
import * as AnalyticsController from "../controllers/AnalyticsController";

const router = express.Router();

const isAdmin = roleBasedAccessControl(["admin"]);

// Rate limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests. Please try again later.",
});

/**
 * Handle route errors
 */
const handleRouteErrors = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error occurred: ${(error as Error).message}`);
      next(error);
    }
  };
};

// @route GET /api/admin/analytics/users
router.get(
  "/users",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const analytics = await AdminController.getUserAnalytics(req, res, next);
    res.json({ success: true, data: analytics });
  })
);

// @route GET /api/admin/analytics/goals
router.get(
  "/goals",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const analytics = await AnalyticsController.getGlobalAnalytics(req, res, next);
    res.json({ success: true, data: analytics });
  })
);

// @route GET /api/admin/analytics/posts
router.get(
  "/posts",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const analytics = await AnalyticsController.getGlobalAnalytics(req, res, next);
    res.json({ success: true, data: analytics });
  })
);

// @route GET /api/admin/analytics/financial
router.get(
  "/financial",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const analytics = await AdminController.getFinancialAnalytics(req, res, next);
    res.json({ success: true, data: analytics });
  })
);

// @route POST /api/admin/analytics/custom
router.post(
  "/custom",
  [
    authMiddleware,
    isAdmin,
    rateLimiter,
    check("startDate").notEmpty().withMessage("Start date is required").isISO8601().withMessage("Invalid date format"),
    check("endDate").notEmpty().withMessage("End date is required").isISO8601().withMessage("Invalid date format"),
    check("metric").notEmpty().withMessage("Metric is required").isString().withMessage("Metric must be a string"),
  ],
  handleRouteErrors(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation failed for custom analytics: ${JSON.stringify(errors.array())}`);
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { startDate, endDate, metric } = req.body;
    const analytics = await AnalyticsController.getCustomAnalytics(startDate, endDate, metric);
    res.json({ success: true, data: analytics });
  })
);

export default router;
