import axios from 'axios';
import { getAuthHeader } from './authService';  // Ensure token management is handled centrally

// Create an axios instance for the activity API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/activities',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to include the Authorization header automatically
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

// Fetch recent activities
export const getRecentActivities = async () => {
  return axiosRetry(() => apiClient.get('/'));
};

// Create a new activity
export const createActivity = async (activityData) => {
  return axiosRetry(() => apiClient.post('/create', activityData));
};

// Update an existing activity
export const updateActivity = async (activityId, activityData) => {
  return axiosRetry(() => apiClient.put(`/update/${activityId}`, activityData));
};

// Delete an activity
export const deleteActivity = async (activityId) => {
  return axiosRetry(() => apiClient.delete(`/delete/${activityId}`));
};

export default {
  getRecentActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
