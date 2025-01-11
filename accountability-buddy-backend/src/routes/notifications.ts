import express, { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import sanitize from "mongo-sanitize";
import authMiddleware from "../middleware/authMiddleware";
import * as NotificationController from "../controllers/NotificationController";
import logger from "../utils/winstonLogger";

const router: Router = express.Router();

/**
 * Rate limiter to prevent spam requests for SMS notifications.
 */
const notificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many notifications sent from this IP, please try again later.",
  },
});

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return; // Exit early to prevent further processing
  }
  next();
};

/**
 * @route   POST /send-sms-notification
 * @desc    Send an SMS notification
 * @access  Private
 */
router.post(
  "/send-sms-notification",
  authMiddleware,
  notificationLimiter,
  [
    check("to", "Please provide a valid recipient phone number").isMobilePhone("any"), // Fixed validation
    check("message", "Message text is required").notEmpty(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Sanitize input data
      const sanitizedBody = sanitize(req.body);
      const { to, message } = sanitizedBody;

      // Ensure required fields are present after sanitization
      if (!to || !message) {
        res.status(400).json({
          success: false,
          message: "Phone number and message are required.",
        });
        return;
      }

      // Call the NotificationController to handle SMS sending
      await NotificationController.sendNotification(req, res, next); // Pass required args

      // Success response
      res.status(200).json({
        success: true,
        message: "SMS notification sent successfully",
      });
    } catch (err) {
      // Log and handle errors
      logger.error("Error sending SMS notification", {
        error: err,
        to: req.body.to,
      });
      next(err); // Forward error to middleware
    }
  }
);

export default router;
