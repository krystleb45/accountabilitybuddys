import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper function to get the Authorization header

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

// Create an axios instance for the subscriptions API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/subscription',
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

// Fetch subscription status
export const getSubscriptionStatus = async () => {
  return axiosRetry(() => apiClient.get('/status'));
};

// Upgrade subscription
export const upgradeSubscription = async (planId) => {
  return axiosRetry(() => apiClient.post('/upgrade', { planId }));
};

// Downgrade subscription
export const downgradeSubscription = async (planId) => {
  return axiosRetry(() => apiClient.post('/downgrade', { planId }));
};

// Cancel subscription
export const cancelSubscription = async () => {
  return axiosRetry(() => apiClient.post('/cancel'));
};

export default {
  getSubscriptionStatus,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
};
