import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type = "info", duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

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
