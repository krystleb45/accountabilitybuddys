import express, { Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import checkSubscription from "../middleware/checkSubscription"; // Correct subscription middleware import path
import { validateReminder } from "../validators/reminderValidation"; // Correct validation import path
import customReminderController from "../controllers/customReminderController"; // Corrected custom controller import path
import logger from "../utils/winstonLogger"; // Logger utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of reminder functionality.
 */
const reminderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per window
  message: "Too many reminder requests from this IP, please try again later.",
});

/**
 * Middleware to validate user access and input for reminders.
 */
const checkUserRemindersAccess = [
  authMiddleware, // Ensure the user is authenticated
  checkSubscription("standard"), // Only standard and premium users can create reminders
  reminderLimiter, // Apply rate limiting
  validateReminder, // Validate reminder input
];

/**
 * @route   POST /create
 * @desc    Create a custom reminder
 * @access  Private (standard and above)
 */
router.post(
  "/create",
  checkUserRemindersAccess,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sanitizedData = sanitize(req.body);
      const newReminder = await customReminderController.createReminder(
        sanitizedData,
        req.user?.id
      );
      res.status(201).json({
        success: true,
        message: "Reminder created successfully.",
        reminder: newReminder,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error creating custom reminder for user ${req.user?.id}: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   GET /user
 * @desc    Fetch all reminders for the logged-in user
 * @access  Private
 */
router.get(
  "/user",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reminders = await customReminderController.getUserReminders(req.user?.id);
      res.status(200).json({ success: true, reminders });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching reminders for user ${req.user?.id}: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   PUT /disable/:id
 * @desc    Disable a specific reminder by ID
 * @access  Private
 */
router.put(
  "/disable/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reminderId = sanitize(req.params.id);
      const result = await customReminderController.disableReminder(reminderId, req.user?.id);
      res.status(200).json({
        success: true,
        message: "Reminder disabled successfully.",
        result,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error disabling reminder ${req.params.id} for user ${req.user?.id}: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   PUT /edit/:id
 * @desc    Edit an existing reminder
 * @access  Private
 */
router.put(
  "/edit/:id",
  authMiddleware,
  validateReminder,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reminderId = sanitize(req.params.id);
      const sanitizedData = sanitize(req.body);
      const updatedReminder = await customReminderController.editReminder(
        reminderId,
        sanitizedData,
        req.user?.id
      );
      res.status(200).json({
        success: true,
        message: "Reminder updated successfully.",
        updatedReminder,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error editing reminder ${req.params.id} for user ${req.user?.id}: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   DELETE /delete/:id
 * @desc    Delete a reminder by ID
 * @access  Private
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reminderId = sanitize(req.params.id);
      const result = await customReminderController.deleteReminder(reminderId, req.user?.id);
      res.status(200).json({
        success: true,
        message: "Reminder deleted successfully.",
        result,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error deleting reminder ${req.params.id} for user ${req.user?.id}: ${errorMessage}`);
      next(error);
    }
  }
);

export default router;
