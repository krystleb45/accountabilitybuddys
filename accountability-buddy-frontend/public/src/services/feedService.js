import axios from 'axios';
import { getAuthHeader } from './authService';  // Ensure token management is handled centrally

// Create an axios instance for the feed API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/feed',
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

// Fetch feed posts
export const getFeedPosts = async () => {
  return axiosRetry(() => apiClient.get('/'));
};

// Create a new feed post
export const createFeedPost = async (postData) => {
  return axiosRetry(() => apiClient.post('/post', postData));
};

// Update a feed post
export const updateFeedPost = async (postId, postData) => {
  return axiosRetry(() => apiClient.put(`/post/${postId}`, postData));
};

// Delete a feed post
export const deleteFeedPost = async (postId) => {
  return axiosRetry(() => apiClient.delete(`/post/${postId}`));
};

export default {
  getFeedPosts,
  createFeedPost,
  updateFeedPost,
  deleteFeedPost,
};
