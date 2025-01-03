import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAsRead, setMarkingAsRead] = useState(false);

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://accountabilitybuddys.com/api/notifications');
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error('Failed to load notifications:', err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setMarkingAsRead(true);
    setError('');
    try {
      await axios.post('https://accountabilitybuddys.com/api/notifications/mark-all-read');
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
      setError('Failed to mark notifications as read. Please try again.');
    } finally {
      setMarkingAsRead(false);
    }
  };

  return (
    <div className="notifications-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Notifications</h1>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <>
          <button
            onClick={markAllAsRead}
            disabled={markingAsRead}
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {markingAsRead ? 'Marking as Read...' : 'Mark All as Read'}
          </button>

          <ul className="notifications-list" style={{ listStyleType: 'none', padding: '0' }}>
            {notifications.map((notification, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: notification.read ? '#f0f0f0' : '#fff',
                }}
              >
                <p style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>{notification.message}</p>
                <small>{new Date(notification.date).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}

      {!loading && notifications.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationsPage;
