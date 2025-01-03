import React, { useState, useEffect } from "react";
import {
  getPartnerNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "./services/apiService";
import "./PartnerNotifications.css"; // Import CSS for styling

// Define the Notification type used in this component
interface Notification {
  id: string;
  message: string;
  isRead: boolean; // Use isRead for the local type
}

const PartnerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPartnerNotifications();

        // Map 'read' to 'isRead' to match the local Notification type
        const formattedNotifications: Notification[] = data.map((item) => ({
          id: item.id,
          message: item.message,
          isRead: item.read, // Map 'read' from API to 'isRead' in local type
        }));

        setNotifications(formattedNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="error-message" role="alert">{error}</p>;

  return (
    <div
      className="partner-notifications"
      role="region"
      aria-label="Partner Notifications"
    >
      <h2>Partner Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={notification.isRead ? "read" : "unread"}
            >
              <p>{notification.message}</p>
              <button onClick={() => handleMarkAsRead(notification.id)}>
                Mark as Read
              </button>
              <button onClick={() => handleDeleteNotification(notification.id)}>
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
