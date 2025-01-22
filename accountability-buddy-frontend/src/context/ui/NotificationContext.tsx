// NotificationContext.tsx

import React, { createContext, useState, useContext, useCallback, ReactNode } from "react";

// Define the shape of a notification
interface Notification {
  id: number;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

// Define the shape of the NotificationContext
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: "info" | "success" | "error" | "warning",
    duration?: number
  ) => void;
  removeNotification: (id: number) => void;
  clearAllNotifications: () => void; // New method to clear all notifications
}

// Create Notification Context with the appropriate type
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Custom hook to use NotificationContext
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

// NotificationProvider component props
interface NotificationProviderProps {
  children: ReactNode;
}

// Notification Context Provider
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a new notification with message, type, and duration
  const addNotification = useCallback(
    (
      message: string,
      type: "info" | "success" | "error" | "warning" = "info",
      duration: number = 5000
    ) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);

      // Automatically remove the notification after the specified duration
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    []
  );

  // Remove notification by ID
  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAllNotifications }}
    >
      {children}
      <div className="notification-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification-banner ${type}`}>
            {message}
            <button
              onClick={() => removeNotification(id)}
              className="close-button"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Optional styles for notification container and banner
const styles = `
  .notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .notification-banner {
    padding: 15px;
    border-radius: 5px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 250px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.5s;
  }
  .notification-banner.info { background-color: #2196f3; }
  .notification-banner.success { background-color: #4caf50; }
  .notification-banner.error { background-color: #f44336; }
  .notification-banner.warning { background-color: #ff9800; }
  .close-button {
    margin-left: 10px;
    padding: 5px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default NotificationContext;