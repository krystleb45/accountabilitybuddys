import { useState, useCallback } from "react";

/**
 * Type definition for a notification.
 */
interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  duration?: number; // Optional duration for auto-dismiss
}

/**
 * Custom hook for managing notifications.
 *
 * This hook provides utilities to add, remove, and manage notifications.
 *
 * @returns An object containing notification state and management functions.
 */
const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a new notification
  const addNotification = useCallback(
    (
      message: string,
      type: "info" | "success" | "error" | "warning" = "info",
      duration: number = 5000 // Default duration: 5 seconds
    ) => {
      const id = Date.now().toString();
      const newNotification: Notification = { id, message, type, duration };

      setNotifications((prev) => [...prev, newNotification]);

      // Automatically remove the notification after the specified duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  // Remove a notification by ID
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};

export default useNotifications;
export type { Notification };
