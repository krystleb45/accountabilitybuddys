import axios from 'axios';
import { getAuthHeader } from '../services/authService';  // Ensure the token is included in requests

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle API errors
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};


// Fetch all reminders for the user
export const fetchReminders = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new reminder
export const createReminder = async (reminderData) => {
  try {
    const response = await axios.post(`${API_URL}`, reminderData, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update an existing reminder
export const updateReminder = async (reminderId, reminderData) => {
  try {
    const response = await axios.put(`${API_URL}/${reminderId}`, reminderData, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Disable a reminder
export const disableReminder = async (reminderId) => {
  try {
    const response = await axios.put(`${API_URL}/${reminderId}/disable`, {}, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete a reminder
export const deleteReminder = async (reminderId) => {
  try {
    const response = await axios.delete(`${API_URL}/${reminderId}`, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
