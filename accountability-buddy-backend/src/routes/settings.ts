import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import * as settingsController from "../controllers/SettingsController"; // Corrected controller import path
import logger from "../utils/winstonLogger"; // Added logging utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of settings updates.
 */
const settingsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per IP per window
  message: "Too many settings update requests from this IP, please try again later.",
});

/**
 * Middleware to sanitize user input.
 */
const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = sanitize(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

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
 * @route   GET /settings
 * @desc    Get the current user's settings
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const settings = await settingsController.getUserSettings(req.user.id);
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
      logger.error(`Error fetching settings: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   PUT /settings/update
 * @desc    Update the current user's settings
 * @access  Private
 */
router.put(
  "/update",
  authMiddleware,
  settingsLimiter,
  sanitizeInput,
  [
    check("emailNotifications", "Invalid value for email notifications").optional().isBoolean(),
    check("smsNotifications", "Invalid value for SMS notifications").optional().isBoolean(),
    check("theme", "Invalid theme selection").optional().isIn(["light", "dark"]),
    check("language", "Invalid language selection")
      .optional()
      .isIn(["en", "es", "fr", "de", "zh"]),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const updatedSettings = await settingsController.updateUserSettings(req.user.id, req.body);
      res.status(200).json({ success: true, data: updatedSettings });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
      logger.error(`Error updating settings: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   PUT /settings/password
 * @desc    Update the user's password
 * @access  Private
 */
router.put(
  "/password",
  authMiddleware,
  sanitizeInput,
  [
    check("currentPassword", "Current password is required").notEmpty(),
    check("newPassword", "New password must be at least 6 characters long").isLength({ min: 6 }),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    try {
      await settingsController.updateUserPassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({ success: true, msg: "Password updated successfully" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
      logger.error(`Error updating password: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   PUT /settings/notifications
 * @desc    Update notification preferences
 * @access  Private
 */
router.put(
  "/notifications",
  authMiddleware,
  sanitizeInput,
  [
    check("emailNotifications", "Invalid value for email notifications").isBoolean(),
    check("smsNotifications", "Invalid value for SMS notifications").isBoolean(),
    check("pushNotifications", "Invalid value for push notifications").isBoolean(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const updatedNotifications = await settingsController.updateNotificationPreferences(
        req.user.id,
        req.body
      );
      res.status(200).json({ success: true, data: updatedNotifications });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
      logger.error(`Error updating notification preferences: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   DELETE /settings/account
 * @desc    Deactivate or delete user account
 * @access  Private
 */
router.delete(
  "/account",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      await settingsController.deactivateUserAccount(req.user.id);
      res.status(200).json({ success: true, msg: "Account deactivated successfully" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
      logger.error(`Error deactivating account: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

export default router;
