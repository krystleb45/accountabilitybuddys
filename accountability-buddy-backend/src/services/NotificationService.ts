import nodemailer from "nodemailer";
import Notification from "../models/Notification";
import LoggingService from "./LoggingService"; // For logging errors and info
import client from "../config/twilioConfig"; // Twilio client for SMS
import firebaseAdmin from "../config/firebaseConfig"; // Firebase Admin SDK for push notifications

// Setup email transporter (reusable)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465", // Use SSL if port is 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  from?: string;
  cc?: string;
  bcc?: string;
  attachments?: Array<{ filename: string; path: string }>;
  html?: string;
}

const NotificationService = {
  /**
   * Send Email Notification
   * @param {string} to - Recipient's email address
   * @param {string} subject - Subject of the email
   * @param {string} text - Email body content
   * @param {EmailOptions} [options] - Optional email configurations (e.g., attachments, HTML content)
   */
  sendEmail: async (
    to: string,
    subject: string,
    text: string,
    options: EmailOptions = {},
  ): Promise<void> => {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...options,
    };

    try {
      await transporter.sendMail(mailOptions);
      LoggingService.logInfo(`Email sent to ${to} with subject: ${subject}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      LoggingService.logError(
        "Error sending email notification",
        new Error(errorMessage),
        { to, subject },
      );
      throw new Error("Failed to send email notification");
    }
  },

  /**
   * Send In-App Notification
   * @param {string} userId - ID of the user to receive the notification
   * @param {string} message - Notification message content
   */
  sendInAppNotification: async (
    userId: string,
    message: string,
  ): Promise<void> => {
    try {
      const notification = new Notification({
        userId,
        message,
        date: new Date(),
        read: false, // Mark as unread by default
      });
      await notification.save();
      LoggingService.logInfo(`In-app notification sent to user: ${userId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      LoggingService.logError(
        "Error sending in-app notification",
        new Error(errorMessage),
        { userId, message },
      );
      throw new Error("Failed to send in-app notification");
    }
  },

  /**
   * Send SMS Notification using Twilio
   * @param {string} to - Recipient's phone number
   * @param {string} message - SMS message content
   */
  sendSMS: async (to: string, message: string): Promise<void> => {
    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      LoggingService.logInfo(`SMS sent to ${to}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      LoggingService.logError(
        "Error sending SMS notification",
        new Error(errorMessage),
        { to, message },
      );
      throw new Error("Failed to send SMS notification");
    }
  },

  /**
   * Send Push Notification
   * @param {string} deviceToken - Device token for the push notification
   * @param {string} message - Push notification message content
   */
  sendPushNotification: async (
    deviceToken: string,
    message: string,
  ): Promise<void> => {
    try {
      const payload = {
        notification: {
          title: "New Notification",
          body: message,
        },
      };
      const response = await firebaseAdmin
        .messaging()
        .send({ token: deviceToken, ...payload });
      LoggingService.logInfo(
        `Push notification sent to device token: ${deviceToken} with response: ${response}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      LoggingService.logError(
        "Error sending push notification",
        new Error(errorMessage),
        { deviceToken, message },
      );
      throw new Error("Failed to send push notification");
    }
  },

  /**
   * Send Batch Notifications (Multiple Users)
   * @param {string[]} userIds - Array of user IDs to receive the notification
   * @param {string} message - Notification message content
   */
  sendBatchInAppNotifications: async (
    userIds: string[],
    message: string,
  ): Promise<void> => {
    try {
      const notifications = userIds.map((userId) => ({
        userId,
        message,
        date: new Date(),
        read: false,
      }));
      await Notification.insertMany(notifications);
      LoggingService.logInfo(
        `Batch in-app notifications sent to users: ${userIds.join(", ")}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      LoggingService.logError(
        "Error sending batch in-app notifications",
        new Error(errorMessage),
        { userIds },
      );
      throw new Error("Failed to send batch in-app notifications");
    }
  },
};

export default NotificationService;
