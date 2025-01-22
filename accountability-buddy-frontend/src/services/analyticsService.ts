import axios, { InternalAxiosRequestConfig } from 'axios';

// Define types for analytics data
export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  [key: string]: number; // Allow flexibility for additional metrics
}

export interface ActivityAnalytics {
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  [key: string]: number; // Allow flexibility for additional metrics
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

// Create an axios instance for analytics API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/analytics',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization header or other request-level configurations here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

const AnalyticsService = {
  /**
   * Fetch user analytics data.
   *
   * @returns {Promise<UserAnalytics>} - The user analytics data.
   */
  getUserAnalytics: async (): Promise<UserAnalytics> => {
    try {
      const response = await apiClient.get('/users');
      return response.data as UserAnalytics;
    } catch (error) {
      return Promise.reject(handleApiError(error));
    }
  },

  /**
   * Fetch activity analytics data.
   *
   * @returns {Promise<ActivityAnalytics>} - The activity analytics data.
   */
  getActivityAnalytics: async (): Promise<ActivityAnalytics> => {
    try {
      const response = await apiClient.get('/activities');
      return response.data as ActivityAnalytics;
    } catch (error) {
      return Promise.reject(handleApiError(error));
    }
  },

  /**
   * Fetch detailed analytics for a specific timeframe.
   *
   * @param {string} startDate - The start date for the analytics data (YYYY-MM-DD).
   * @param {string} endDate - The end date for the analytics data (YYYY-MM-DD).
   * @returns {Promise<any>} - The detailed analytics data for the specified timeframe.
   */
  getDetailedAnalytics: async (startDate: string, endDate: string): Promise<any> => {
    try {
      const response = await apiClient.get('/detailed', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Fetch custom analytics data by category.
   *
   * @param {string} category - The category of analytics to fetch (e.g., "user", "activity").
   * @returns {Promise<any>} - The analytics data for the specified category.
   */
  getAnalyticsByCategory: async (category: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/category/${category}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default AnalyticsService;