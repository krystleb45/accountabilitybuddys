import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper function to get Authorization header

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

// Create an axios instance for the analytics API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/analytics',
});

// Axios interceptor to add the Authorization header dynamically before each request
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();  // Get the updated token
    if (authHeader) {
      config.headers = { ...config.headers, ...authHeader };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch goal analytics for the current user
export const getGoalAnalytics = async () => {
  return axiosRetry(() => apiClient.get('/goals'));
};

// Fetch activity analytics for the current user
export const getActivityAnalytics = async () => {
  return axiosRetry(() => apiClient.get('/activities'));
};

// Fetch user growth analytics
export const getUserGrowthAnalytics = async () => {
  return axiosRetry(() => apiClient.get('/users'));
};

// Fetch engagement rate analytics
export const getEngagementAnalytics = async () => {
  return axiosRetry(() => apiClient.get('/engagement'));
};

export default {
  getGoalAnalytics,
  getActivityAnalytics,
  getUserGrowthAnalytics,
  getEngagementAnalytics,
};
