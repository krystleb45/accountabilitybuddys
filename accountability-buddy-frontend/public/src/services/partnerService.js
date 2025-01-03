import axios from 'axios';
import { getAuthHeader } from './authService';  // Use the helper function for getting the token

// Create an axios instance for partners API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/partners',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();  // Fetch the token
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

// Notify a partner about a milestone
export const notifyPartner = async (partnerId, goal, milestone) => {
  return axiosRetry(() => apiClient.post('/notify', { partnerId, goal, milestone }));
};

// Fetch the list of partners
export const fetchPartners = async () => {
  return axiosRetry(() => apiClient.get('/list'));
};

// Send a partner request
export const sendPartnerRequest = async (partnerId) => {
  return axiosRetry(() => apiClient.post('/request', { partnerId }));
};

// Accept a partner request
export const acceptPartnerRequest = async (requestId) => {
  return axiosRetry(() => apiClient.post(`/accept/${requestId}`));
};

// Decline a partner request
export const declinePartnerRequest = async (requestId) => {
  return axiosRetry(() => apiClient.post(`/decline/${requestId}`));
};

export default {
  notifyPartner,
  fetchPartners,
  sendPartnerRequest,
  acceptPartnerRequest,
  declinePartnerRequest,
};
