import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper function for Authorization header

// Create an axios instance for support API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/support',
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

// Contact support function
export const contactSupport = async (supportData) => {
  return axiosRetry(() => apiClient.post('/contact', supportData));
};

// Fetch support tickets for the user
export const getSupportTickets = async () => {
  return axiosRetry(() => apiClient.get('/tickets'));
};

// Get details of a specific support ticket
export const getTicketDetails = async (ticketId) => {
  return axiosRetry(() => apiClient.get(`/tickets/${ticketId}`));
};

// Update a support ticket
export const updateSupportTicket = async (ticketId, updateData) => {
  return axiosRetry(() => apiClient.put(`/tickets/${ticketId}`, updateData));
};

export default {
  contactSupport,
  getSupportTickets,
  getTicketDetails,
  updateSupportTicket,
};
