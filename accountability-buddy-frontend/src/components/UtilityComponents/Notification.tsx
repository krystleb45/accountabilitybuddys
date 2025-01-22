import React from "react";
import "./Notification.css"; // CSS for styling the notification

interface NotificationProps {
  message: string; // The notification message
  type?: "success" | "error" | "warning" | "info"; // The type of notification
  onClose?: () => void; // Optional callback to handle notification dismissal
  autoDismiss?: boolean; // Whether the notification should auto-dismiss
  dismissTime?: number; // Time in milliseconds for auto-dismiss
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  onClose,
  autoDismiss = false,
  dismissTime = 3000,
}) => {
  React.useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, dismissTime);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime, onClose]);

  return (
    <div className={`notification notification-${type}`} role="alert" aria-live="assertive">
      <p>{message}</p>
      {onClose && (
        <button className="notification-close-button" onClick={onClose} aria-label="Close notification">
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;
