import React, { createContext, useState, useContext, useCallback } from 'react';

// Create Notification Context
const NotificationContext = createContext();

// Custom hook to use NotificationContext
export const useNotification = () => useContext(NotificationContext);

// Notification Context Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification with message, type, and duration
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Automatically remove the notification after the specified duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  // Remove notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification-banner ${type}`}>
            {message}
            <button onClick={() => removeNotification(id)} className="close-button">X</button>
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
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default NotificationContext;
