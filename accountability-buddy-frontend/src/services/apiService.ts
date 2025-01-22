import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';


// Define base API URL
const API_URL = process.env.API_URL || 'https://accountabilitybuddys.com/api';

// Define types for API responses
export interface DashboardData {
  widgets: any[];
  statistics: any[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface FeedPost {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  author: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

// Utility function to handle API errors
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  throw new Error(
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred. Please try again later.'
  );
};

// Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding authorization tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ApiService = {
  /**
 * Fetch dashboard data.
 *
 * @returns {Promise<DashboardData>} - The dashboard data.
 */
getDashboardData: async (): Promise<DashboardData> => {
  try {
    const response: AxiosResponse<DashboardData> = await apiClient.get('/dashboard');
    return response.data;
  } catch (error) {
    handleApiError(error);
    return {} as DashboardData; // Return an empty DashboardData object
  }
},

  /**
   * Fetch tasks.
   *
   * @returns {Promise<Task[]>} - A list of tasks.
   */
  getTasks: async (): Promise<Task[]> => {
    try {
      const response: AxiosResponse<Task[]> = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      handleApiError(error);
      return [] as Task[];
    }
  },

  /**
   * Update a specific task.
   *
   * @param {string} taskId - The ID of the task to update.
   * @param {Partial<Task>} taskData - The updated task data.
   * @returns {Promise<Task>} - The updated task.
   */
  updateTask: async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await apiClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error; // Add this line to re-throw the error
    }
  },

  /**
   * Fetch notifications.
   *
   * @returns {Promise<Notification[]>} - A list of notifications.
   */
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response: AxiosResponse<Notification[]> = await apiClient.get('/notifications');
      return response.data;
    } catch (error) {
      handleApiError(error);
      return []; // Return an empty array if an error occurs
    }
  },

  /**
   * Mark a notification as read.
   *
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @returns {Promise<void>} - Resolves if successful.
   */
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.post(`/notifications/${notificationId}/read`);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Fetch feed posts.
   *
   * @returns {Promise<FeedPost[]>} - A list of feed posts.
   */
  getFeedPosts: async (): Promise<FeedPost[]> => {
    try {
      const response: AxiosResponse<FeedPost[]> = await apiClient.get('/feed');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error; // Re-throw the error
    }
  },
};

export default ApiService;