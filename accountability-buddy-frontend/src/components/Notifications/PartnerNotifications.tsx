import React, { useState, useEffect } from 'react';
import ApiService from 'src/services/apiService'; // Import the default ApiService
import './PartnerNotifications.css'; // Optional: import CSS for styling

// Define Notification type
interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

// Main Component
const PartnerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async (): Promise<void> => {
      setLoading(true);
      setError('');

      try {
        const apiNotifications = await ApiService.getPartnerNotifications();

        // Map API notifications to include 'isRead' property
        const formattedNotifications: Notification[] = apiNotifications.map(
          (notification: { id: string; message: string; read?: boolean }) => ({
            id: notification.id,
            message: notification.message,
            isRead: notification.read || false, // Default 'isRead' to false
          })
        );

        setNotifications(formattedNotifications);
      } catch (err: unknown) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (id: string): Promise<void> => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Delete a notification
  const handleDelete = async (id: string): Promise<void> => {
    try {
      await ApiService.deleteNotification(id);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div className="partner-notifications">
      <h2>Partner Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <p>{notification.message}</p>
              <div className="actions">
                {!notification.isRead && (
                  <button onClick={() => handleMarkAsRead(notification.id)}>
                    Mark as Read
                  </button>
                )}
                <button onClick={() => handleDelete(notification.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PartnerNotifications;
