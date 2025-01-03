import axios from 'axios';
import { getAuthHeader } from './authService';  // Import the helper function for token handling

// Create an axios instance with base URL and common configurations
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/groups',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();  // Use the helper to get the token
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

// Fetch all groups
export const fetchGroups = async () => {
  return axiosRetry(() => apiClient.get('/'));
};

// Create a new group
export const createGroup = async (groupData) => {
  return axiosRetry(() => apiClient.post('/create', groupData));
};

// Update an existing group
export const updateGroup = async (groupId, groupData) => {
  return axiosRetry(() => apiClient.put(`/update/${groupId}`, groupData));
};

// Delete a group
export const deleteGroup = async (groupId) => {
  return axiosRetry(() => apiClient.delete(`/delete/${groupId}`));
};

// Join a group
export const joinGroup = async (groupId) => {
  return axiosRetry(() => apiClient.post(`/join/${groupId}`));
};

// Leave a group
export const leaveGroup = async (groupId) => {
  return axiosRetry(() => apiClient.post(`/leave/${groupId}`));
};

// Fetch group members
export const fetchGroupMembers = async (groupId) => {
  return axiosRetry(() => apiClient.get(`/${groupId}/members`));
};

export default {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  fetchGroupMembers,
};
