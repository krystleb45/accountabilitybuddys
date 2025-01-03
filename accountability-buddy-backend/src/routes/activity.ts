import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { check } from "express-validator";
import rateLimit from "express-rate-limit";
import Activity from "../models/Activity";
import authMiddleware from "../middleware/authMiddleware";
import validationMiddleware from "../middleware/validationMiddleware";

const router = express.Router();

// Role-Based Access Control
const roleBasedAccessControl = (
  allowedRoles: Array<"user" | "admin" | "moderator">
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Ensure that req.user is defined and has a role if using global augmentation
    if (!req.user || !req.user.role) {
      res.status(401).json({ success: false, message: "Unauthorized access" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Access forbidden for this role" });
      return;
    }

    next();
  };
};

// Rate limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests. Please try again later.",
});

// GET /api/activity
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, msg: "Unauthorized access" });
        return;
      }

      const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json({ success: true, data: activities });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/activity/all
router.get(
  "/all",
  [authMiddleware, roleBasedAccessControl(["admin"])],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activities = await Activity.find().sort({ createdAt: -1 });
      res.json({ success: true, data: activities });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/activity/log
router.post(
  "/log",
  [
    authMiddleware,
    rateLimiter,
    validationMiddleware([
      check("activityType").notEmpty().withMessage("Activity type is required."),
      check("details").optional().isString().withMessage("Details must be a string."),
    ]),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, msg: "Unauthorized access" });
        return;
      }

      const { activityType, details } = req.body;

      const newActivity = new Activity({
        user: req.user.id,
        activityType,
        details,
        createdAt: new Date(),
      });

      await newActivity.save();
      res.status(201).json({ success: true, data: newActivity });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
