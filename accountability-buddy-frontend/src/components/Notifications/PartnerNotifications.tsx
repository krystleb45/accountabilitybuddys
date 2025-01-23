import React, { useState, useEffect } from 'react';
import ApiService from 'src/services/apiService'; // Import the default ApiService
import './PartnerNotifications.css'; // Optional: import CSS for styling

// Extend the Notification type to include 'isRead'
interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

const PartnerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');

      try {
        const apiNotifications = await ApiService.getPartnerNotifications();

        // Map to ensure all notifications have 'isRead' property
        const formattedNotifications: Notification[] = apiNotifications.map(
          (notification) => ({
            id: notification.id,
            message: notification.message,
            isRead: notification.read || false, // Use 'read' from API or default to false
          })
        );

        setNotifications(formattedNotifications);
      } catch (err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ApiService.deleteNotification(id);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  return (
    <div className="partner-notifications">
      <h2>Partner Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={notification.isRead ? 'read' : 'unread'}
            >
              <p>{notification.message}</p>
              <button onClick={() => handleMarkAsRead(notification.id)}>
                Mark as Read
              </button>
              <button onClick={() => handleDelete(notification.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PartnerNotifications;
