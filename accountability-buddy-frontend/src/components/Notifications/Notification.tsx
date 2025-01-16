import React, { useState, useEffect } from "react";
import "./Notification.css";

interface NotificationProps {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  duration = 5000,
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`notification notification-${type}`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default Notification;
