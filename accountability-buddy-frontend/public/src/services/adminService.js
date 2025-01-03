import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper function for Authorization header

// Create an axios instance for admin API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to add the Authorization header to every request
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

// Fetch all users (admin view)
export const getAllUsers = async () => {
  return axiosRetry(() => apiClient.get('/users'));
};

// Block a user
export const blockUser = async (userId) => {
  return axiosRetry(() => apiClient.post(`/users/${userId}/block`));
};

// Unblock a user
export const unblockUser = async (userId) => {
  return axiosRetry(() => apiClient.post(`/users/${userId}/unblock`));
};

// Fetch site analytics (admin view)
export const getSiteAnalytics = async () => {
  return axiosRetry(() => apiClient.get('/analytics'));
};

// Get all reported content
export const getReportedContent = async () => {
  return axiosRetry(() => apiClient.get('/reports'));
};

// Resolve a report
export const resolveReport = async (reportId) => {
  return axiosRetry(() => apiClient.post(`/reports/${reportId}/resolve`));
};

export default {
  getAllUsers,
  blockUser,
  unblockUser,
  getSiteAnalytics,
  getReportedContent,
  resolveReport,
};
