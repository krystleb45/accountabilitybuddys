import React, { useState, useEffect } from 'react';
import {
  getPartnerNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../services/api'; // Replace with your actual API service
import './PartnerNotifications.css'; // Optional: import CSS for styling

const PartnerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getPartnerNotifications(); // API call to get notifications
        setNotifications(response.data); // Assuming API response contains notifications in response.data
      } catch (err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId); // API call to mark as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId); // API call to delete
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== notificationId)
      );
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  return (
    <div className="partner-notifications-container" aria-live="polite">
      <h2>Partner Notifications</h2>

      {/* Loading state */}
      {loading && <div aria-busy="true">Loading notifications...</div>}

      {/* Error state */}
      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {/* No notifications */}
      {notifications.length === 0 && !loading && (
        <div>No partner notifications available.</div>
      )}

      {/* Notifications list */}
      <ul className="notifications-list">
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
          >
            <p>{notification.message}</p>
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
            <div className="notification-actions">
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  aria-label="Mark as Read"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => handleDelete(notification._id)}
                aria-label="Delete Notification"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnerNotifications;
