import { Server, Socket } from "socket.io";
import Notification, { NotificationDocument } from "../models/Notification"; // Ensure the Notification model is typed
import logger from "../utils/winstonLogger"; // Logger utility

/**
 * @desc    Handles socket events related to notifications.
 * @param   io - The socket.io server instance.
 * @param   socket - The socket object representing the client's connection.
 */
const notificationSocket = (io: Server, socket: Socket): void => {
  const userId = socket.user.id as string; // Assuming `socket.user.id` is available and is a string
  logger.info(`User connected for notifications: ${userId}`);

  /**
   * @desc    Fetches notifications for the logged-in user.
   */
  socket.on("fetchNotifications", async () => {
    try {
      const notifications: NotificationDocument[] = await Notification.find({ userId })
        .sort({ date: -1 })
        .limit(50); // Limit to avoid overloading the client

      socket.emit("notifications", notifications); // Send notifications to the client
    } catch (error) {
      logger.error(`Error fetching notifications for user ${userId}: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to fetch notifications." });
    }
  });

  /**
   * @desc    Marks a specific notification as read.
   * @param   notificationId - The ID of the notification to mark as read.
   */
  socket.on("markAsRead", async (notificationId: string) => {
    try {
      // Validate notification ID
      if (!notificationId) {
        return socket.emit("error", { msg: "Notification ID is required." });
      }

      const notification = await Notification.findById(notificationId);

      // Check if the notification exists and belongs to the user
      if (!notification || notification.userId.toString() !== userId) {
        return socket.emit("error", { msg: "Notification not found or access denied." });
      }

      // Mark notification as read and save
      notification.read = true;
      await notification.save();

      socket.emit("notificationUpdated", notification); // Notify client about the update
      logger.info(`Notification ${notificationId} marked as read by user ${userId}`);
    } catch (error) {
      logger.error(`Error marking notification as read for user ${userId}: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to mark notification as read." });
    }
  });

  /**
   * @desc    Sends real-time notifications to the user.
   * @param   notification - The notification object to be sent.
   */
  socket.on("newNotification", (notification: NotificationDocument) => {
    // Ensure that the notification belongs to the user
    if (notification.userId.toString() === userId) {
      socket.emit("newNotification", notification); // Send new notification to the user
      logger.info(`New notification sent to user ${userId}`);
    }
  });

  /**
   * @desc    Handles user disconnection from the notifications socket.
   */
  socket.on("disconnect", () => {
    logger.info(`User disconnected from notifications: ${userId}`);
  });
};

export default notificationSocket;
