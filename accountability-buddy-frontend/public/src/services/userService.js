import axios from 'axios';
import { getAuthHeader } from './authService'; // Import helper to get Authorization header

// Create an axios instance to centralize base URL and headers
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/users',
  headers: getAuthHeader(), // Automatically include the Authorization header
});

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

// Fetch user profile
export const fetchUserProfile = async () => {
  return axiosRetry(() => apiClient.get('/profile'));
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return axiosRetry(() => apiClient.put('/profile', profileData));
};

// Delete user account
export const deleteUserAccount = async () => {
  return axiosRetry(() => apiClient.delete('/account'));
};

// Fetch all users (admin only)
export const fetchAllUsers = async () => {
  return axiosRetry(() => apiClient.get('/all'));
};

// Block or unblock a user (admin only)
export const toggleUserStatus = async (userId, action) => {
  return axiosRetry(() => apiClient.post(`/${userId}/${action}`));
};

export default {
  fetchUserProfile,
  updateUserProfile,
  deleteUserAccount,
  fetchAllUsers,
  toggleUserStatus,
};
