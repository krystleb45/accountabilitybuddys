import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosHeaders } from 'axios';

// Define base API URL
const API_URL = process.env.API_URL || 'https://accountabilitybuddys.com/api';

// Define types for API responses
export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

// Utility function to handle API errors
const handleApiError = (error: unknown): never => {
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
   * Fetch partner notifications.
   *
   * @returns {Promise<Notification[]>} - A list of partner notifications.
   */
  getPartnerNotifications: async (): Promise<Notification[]> => {
    try {
      const response: AxiosResponse<Notification[]> = await apiClient.get(
        '/partner-notifications'
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return [];
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
   * Delete a notification.
   *
   * @param {string} notificationId - The ID of the notification to delete.
   * @returns {Promise<void>} - Resolves if successful.
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default ApiService;
