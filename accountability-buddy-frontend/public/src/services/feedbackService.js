import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper function for Authorization header

// Create an axios instance for feedback API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/feedback',
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

// Submit feedback
export const submitFeedback = async (feedbackData) => {
  return axiosRetry(() => apiClient.post('/submit', feedbackData));
};

// Fetch all feedback (admin view)
export const getAllFeedback = async () => {
  return axiosRetry(() => apiClient.get('/all'));
};

// Fetch feedback details by ID (admin view)
export const getFeedbackDetails = async (feedbackId) => {
  return axiosRetry(() => apiClient.get(`/details/${feedbackId}`));
};

// Mark feedback as resolved (admin view)
export const resolveFeedback = async (feedbackId) => {
  return axiosRetry(() => apiClient.post(`/resolve/${feedbackId}`));
};

export default {
  submitFeedback,
  getAllFeedback,
  getFeedbackDetails,
  resolveFeedback,
};
