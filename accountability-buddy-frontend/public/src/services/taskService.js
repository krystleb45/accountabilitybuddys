import axios from 'axios';
import { getAuthHeader } from './authService';  // Helper function for Authorization header

// Create an axios instance for tasks API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/tasks',
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

// Create a new task
export const createTask = async (taskData) => {
  return axiosRetry(() => apiClient.post('/create', taskData));
};

// Fetch all tasks for the user
export const getUserTasks = async () => {
  return axiosRetry(() => apiClient.get('/list'));
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  return axiosRetry(() => apiClient.put(`/update/${taskId}`, taskData));
};

// Delete a task
export const deleteTask = async (taskId) => {
  return axiosRetry(() => apiClient.delete(`/delete/${taskId}`));
};

// Fetch task details by ID
export const getTaskDetails = async (taskId) => {
  return axiosRetry(() => apiClient.get(`/details/${taskId}`));
};

export default {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  getTaskDetails,
};
