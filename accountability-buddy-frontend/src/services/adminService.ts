import axios, { InternalAxiosRequestConfig, AxiosHeaders, AxiosResponse } from "axios";
import { getAuthHeader } from "./authService";

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
}

// Create an axios instance for admin API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authHeader = getAuthHeader(); // Get the token from the helper
    if (authHeader) {
      // Ensure headers use AxiosHeaders to meet the required type
      config.headers = config.headers || new AxiosHeaders();
      Object.entries(authHeader).forEach(([key, value]) => {
        (config.headers as AxiosHeaders).set(key, value as string);
      });
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<AxiosResponse<T>>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fn();
      return response.data;
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000;
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

// Fetch all users (admin view)
export const getAllUsers = async (): Promise<User[]> => {
  return axiosRetry(() => apiClient.get<User[]>("/users"));
};

// Block a user
export const blockUser = async (userId: string): Promise<void> => {
  return axiosRetry(() => apiClient.post<void>(`/users/${userId}/block`));
};

// Unblock a user
export const unblockUser = async (userId: string): Promise<void> => {
  return axiosRetry(() => apiClient.post<void>(`/users/${userId}/unblock`));
};

// Fetch site analytics (admin view)
export const getSiteAnalytics = async (): Promise<Analytics> => {
  return axiosRetry(() => apiClient.get<Analytics>("/analytics"));
};

// Get all reported content
export const getReportedContent = async (): Promise<Report[]> => {
  return axiosRetry(() => apiClient.get<Report[]>("/reports"));
};

// Resolve a report
export const resolveReport = async (reportId: string): Promise<void> => {
  return axiosRetry(() => apiClient.post<void>(`/reports/${reportId}/resolve`));
};

export default {
  getAllUsers,
  blockUser,
  unblockUser,
  getSiteAnalytics,
  getReportedContent,
  resolveReport,
};
