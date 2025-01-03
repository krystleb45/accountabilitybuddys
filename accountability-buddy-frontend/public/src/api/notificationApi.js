import axios from 'axios';
import { getAuthHeader } from '../services/authService'; // Helper to get auth header with token

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle errors
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};


// Fetch all notifications for the current user
export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${API_URL}/${notificationId}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch unread notifications count
export const fetchUnreadNotificationCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/unread-count`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${API_URL}`, notificationData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
