import express, { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import sanitize from "mongo-sanitize";
import authMiddleware from "../middleware/authMiddleware";
import smsMiddleware from "../middleware/smsMiddleware";
import webPushMiddleware from "../middleware/webPushMiddleware";
import * as NotificationController from "../controllers/NotificationController";
import logger from "../utils/winstonLogger";

const router = express.Router();

/**
 * Rate limiter to prevent abuse (e.g., spam notification requests).
 */
const notificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many notifications sent from this IP, please try again later",
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
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * Nodemailer transporter configuration for email notifications.
 */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @route   POST /send-notification
 * @desc    Send an email notification
 * @access  Private
 */
router.post(
  "/send-notification",
  authMiddleware,
  notificationLimiter,
  [
    check("to", "Please provide a valid recipient email").isEmail(),
    check("subject", "Subject is required").notEmpty(),
    check("text", "Message text is required").notEmpty(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { to, subject, text } = sanitize(req.body);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Notification sent: ${info.response}`);
      res.status(200).json({ success: true, message: "Notification sent successfully" });
    } catch (err) {
      logger.error("Error sending notification", { error: err, email: req.body.to });
      res.status(500).json({ success: false, message: "Failed to send notification" });
    }
  }
);

/**
 * @route   POST /send-sms-notification
 * @desc    Send an SMS notification
 * @access  Private
 */
router.post(
  "/send-sms-notification",
  authMiddleware,
  smsMiddleware,
  notificationLimiter,
  [
    check("to", "Please provide a valid recipient phone number").isMobilePhone(),
    check("message", "Message text is required").notEmpty(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { to, message } = sanitize(req.body);
      await NotificationController.sendSMSNotification(to, message);
      res.status(200).json({ success: true, message: "SMS notification sent successfully" });
    } catch (err) {
      logger.error("Error sending SMS notification", { error: err, to: req.body.to });
      res.status(500).json({ success: false, message: "Failed to send SMS notification" });
    }
  }
);

/**
 * @route   POST /send-web-push-notification
 * @desc    Send a Web Push notification
 * @access  Private
 */
router.post(
  "/send-web-push-notification",
  authMiddleware,
  webPushMiddleware,
  notificationLimiter,
  [
    check("subscription", "Web Push subscription is required").notEmpty(),
    check("message", "Message text is required").notEmpty(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { subscription, message } = sanitize(req.body);
      await NotificationController.sendWebPushNotification(subscription, message);
      res.status(200).json({ success: true, message: "Web Push notification sent successfully" });
    } catch (err) {
      logger.error("Error sending Web Push notification", { error: err });
      res.status(500).json({ success: false, message: "Failed to send Web Push notification" });
    }
  }
);

/**
 * @route   GET /notifications
 * @desc    Get all notifications for the logged-in user
 * @access  Private
 */
router.get(
  "/notifications",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const notifications = await NotificationController.getUserNotifications(req.user.id);
      res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      logger.error("Error fetching notifications", { error: err, userId: req.user.id });
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  }
);

/**
 * @route   PUT /notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put(
  "/notifications/:id/read",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await NotificationController.markNotificationAsRead(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (err) {
      logger.error("Error marking notification as read", { error: err, id: req.params.id });
      res.status(500).json({ success: false, message: "Failed to mark notification as read" });
    }
  }
);

/**
 * @route   PUT /notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put(
  "/notifications/read-all",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await NotificationController.markAllNotificationsAsRead(req.user.id);
      res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
      logger.error("Error marking all notifications as read", { error: err, userId: req.user.id });
      res.status(500).json({ success: false, message: "Failed to mark notifications as read" });
    }
  }
);

/**
 * @route   DELETE /notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete(
  "/notifications/:id",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await NotificationController.deleteNotification(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (err) {
      logger.error("Error deleting notification", { error: err, id: req.params.id });
      res.status(500).json({ success: false, message: "Failed to delete notification" });
    }
  }
);

export default router;
