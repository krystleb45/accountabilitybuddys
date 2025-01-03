import { Request, Response, NextFunction } from "express";
import Notification from "../models/Notification"; // Adjusted import
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";

const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input.replace(/\$|\./g, "");
  }
  if (typeof input === "object" && input !== null) {
    for (const key in input) {
      input[key] = sanitizeInput(input[key]);
    }
  }
  return input;
};

// Send a notification
export const sendNotification = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { receiverId, message } = sanitizeInput(req.body);
    const senderId = req.user?.id;

    if (!receiverId) {
      sendResponse(res, 400, false, "Receiver ID is required");
      return;
    }

    if (!message || message.trim() === "") {
      sendResponse(res, 400, false, "Notification content cannot be empty");
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      sendResponse(res, 404, false, "Receiver not found");
      return;
    }

    const newNotification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      content: message,
    });

    logger.info(`Notification sent from user ${senderId} to user ${receiverId}`);
    sendResponse(res, 201, true, "Notification sent successfully", {
      notification: newNotification,
    });
  }
);

// Get notifications for the user
export const getNotifications = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;

    const notifications = await Notification.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments({ receiver: userId });

    sendResponse(res, 200, true, "Notifications fetched successfully", {
      notifications,
      pagination: {
        totalNotifications,
        currentPage: page,
        totalPages: Math.ceil(totalNotifications / limit),
      },
    });
  }
);

// Mark notifications as read
export const markNotificationsAsRead = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    const { notificationIds } = req.body;

    const result = await Notification.updateMany(
      { receiver: userId, _id: { $in: notificationIds }, isRead: false },
      { isRead: true }
    );

    sendResponse(res, 200, true, "Notifications marked as read", {
      updatedCount: result.modifiedCount,
    });
  }
);

// Delete a notification
export const deleteNotification = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      sendResponse(res, 404, false, "Notification not found");
      return;
    }

    await notification.deleteOne();
    logger.info(`Notification with ID ${notificationId} deleted`);
    sendResponse(res, 200, true, "Notification deleted successfully");
  }
);
