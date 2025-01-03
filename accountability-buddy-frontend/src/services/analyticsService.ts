import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import { getAuthHeader } from "./authService"; // Helper function to get Authorization header

// Define response types for analytics endpoints
export interface GoalAnalytics {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
}

export interface ActivityAnalytics {
  totalActivities: number;
  joinedActivities: number;
}

export interface UserGrowthAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
}

export interface EngagementAnalytics {
  engagementRate: number;
  activeUsers: number;
  averageSessionDuration: string;
}

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<AxiosResponse<T>>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fn();
      return response.data;
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error("Request failed:", error);
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again.",
        );
      }
    }
  }
  throw new Error("Max retries reached");
};

// Create an axios instance for the analytics API
const apiClient: AxiosInstance = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/analytics",
});

// Axios interceptor to add the Authorization header dynamically before each request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authHeader = getAuthHeader(); // Get the updated token
    if (authHeader) {
      config.headers = config.headers || new AxiosHeaders();
      Object.entries(authHeader).forEach(([key, value]) => {
        (config.headers as AxiosHeaders).set(key, value as string);
      });
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Fetch goal analytics for the current user
export const getGoalAnalytics = async (): Promise<GoalAnalytics> => {
  return axiosRetry(() => apiClient.get<GoalAnalytics>("/goals"));
};

// Fetch activity analytics for the current user
export const getActivityAnalytics = async (): Promise<ActivityAnalytics> => {
  return axiosRetry(() => apiClient.get<ActivityAnalytics>("/activities"));
};

// Fetch user growth analytics
export const getUserGrowthAnalytics = async (): Promise<UserGrowthAnalytics> => {
  return axiosRetry(() => apiClient.get<UserGrowthAnalytics>("/users"));
};

// Fetch engagement rate analytics
export const getEngagementAnalytics = async (): Promise<EngagementAnalytics> => {
  return axiosRetry(() => apiClient.get<EngagementAnalytics>("/engagement"));
};

export default {
  getGoalAnalytics,
  getActivityAnalytics,
  getUserGrowthAnalytics,
  getEngagementAnalytics,
};
