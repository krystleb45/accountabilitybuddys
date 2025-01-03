import axios from 'axios';
import { getAuthHeader } from './authService';  // Ensure token management is handled centrally

// Create an axios instance for reminders API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/reminders',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers = { ...config.headers, ...authHeader };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries for axios requests with exponential backoff
const axiosRetry = async (fn, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      // Only retry for server errors (status code >= 500)
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error('Request failed:', error); // Log the error for debugging
        throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    }
  }
};

// Set a new reminder
export const setReminder = async (reminderData) => {
  return axiosRetry(() => apiClient.post('/create', reminderData));
};

// Update an existing reminder
export const updateReminder = async (reminderId, reminderData) => {
  return axiosRetry(() => apiClient.put(`/update/${reminderId}`, reminderData));
};

// Fetch all reminders for the user
export const fetchReminders = async () => {
  return axiosRetry(() => apiClient.get('/list'));
};

// Delete a reminder
export const deleteReminder = async (reminderId) => {
  return axiosRetry(() => apiClient.delete(`/delete/${reminderId}`));
};

export default {
  setReminder,
  updateReminder,
  fetchReminders,
  deleteReminder,
};
