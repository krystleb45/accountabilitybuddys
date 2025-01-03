import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper to get the Authorization header

// Create an axios instance for notifications API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/notifications',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();  // Get the token from the helper
    if (authHeader) {
      config.headers = { ...config.headers, ...authHeader };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries with exponential backoff
const axiosRetry = async (fn, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000;  // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));  // Wait before retrying
        attempt++;
      } else {
        console.error('Request failed:', error); // Log error for debugging
        throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    }
  }
};

// Get all notifications for the current user
export const getUserNotifications = async () => {
  return axiosRetry(() => apiClient.get('/user'));
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  return axiosRetry(() => apiClient.post(`/read/${notificationId}`));
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  return axiosRetry(() => apiClient.post('/read-all'));
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  return axiosRetry(() => apiClient.delete(`/delete/${notificationId}`));
};

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
