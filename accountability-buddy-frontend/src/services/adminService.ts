import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthHeader } from './authService';

// Define types for API responses
export interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  reports: number;
}

export interface Report {
  id: string;
  contentId: string;
  reason: string;
  status: string;
  createdAt: string;
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

// Create an axios instance for admin API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authHeader = getAuthHeader() as { token: string }; // Get the token from the helper
    if (authHeader && authHeader.token) {
      const headers = new axios.AxiosHeaders();
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', `Bearer ${authHeader.token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AdminService = {
  /**
   * Fetch a list of users with optional pagination.
   *
   * @param {number} page - The page number to fetch.
   * @param {number} limit - The number of users per page.
   * @returns {Promise<{ users: User[]; total: number }>} - A list of users and the total count.
   */
  listUsers: async (page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get('/users', { params: { page, limit } });
      return {
        users: response.data.users as User[],
        total: response.data.total,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Block a user by their ID.
   *
   * @param {string} userId - The ID of the user to block.
   * @returns {Promise<void>} - Resolves if the operation is successful.
   */
  blockUser: async (userId: string): Promise<void> => {
    try {
      await apiClient.post(`/users/${userId}/block`);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Unblock a user by their ID.
   *
   * @param {string} userId - The ID of the user to unblock.
   * @returns {Promise<void>} - Resolves if the operation is successful.
   */
  unblockUser: async (userId: string): Promise<void> => {
    try {
      await apiClient.post(`/users/${userId}/unblock`);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Fetch analytics data.
   *
   * @returns {Promise<Analytics>} - The analytics data for the admin dashboard.
   */
  getAnalytics: async (): Promise<Analytics | undefined> => {
    try {
      const response = await apiClient.get('/analytics');
      return response.data as Analytics;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Fetch a list of reports with optional pagination.
   *
   * @param {number} page - The page number to fetch.
   * @param {number} limit - The number of reports per page.
   * @returns {Promise<{ reports: Report[]; total: number }>} - A list of reports and the total count.
   */
  listReports: async (page: number = 1, limit: number = 10): Promise<{ reports: Report[]; total: number } | undefined> => {
    try {
      const response = await apiClient.get('/reports', { params: { page, limit } });
      return {
        reports: response.data.reports as Report[],
        total: response.data.total,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Handle a report by marking it as resolved or taking specific actions.
   *
   * @param {string} reportId - The ID of the report to handle.
   * @param {string} action - The action to take (e.g., "resolve").
   * @returns {Promise<void>} - Resolves if the operation is successful.
   */
  handleReport: async (reportId: string, action: string): Promise<void> => {
    try {
      await apiClient.post(`/reports/${reportId}`, { action });
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default AdminService;
