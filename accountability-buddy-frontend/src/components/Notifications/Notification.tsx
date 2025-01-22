import React, { useState, useEffect } from "react";
import "./Notification.css";

type NotificationProps = {
  message: string;
  type?: string; // Update the type here
  duration?: number;
  onDismiss?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  duration = 5000,
  onDismiss,
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`notification notification-${type}`}
      role="alert"
      aria-live="assertive"
    >
      <p>{message}</p>
      {onDismiss && (
        <button
          className="notification-close"
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          aria-label="Close notification"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;
