import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Helper to get the Authorization header

// Define types for notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string; // ISO string for timestamp
  [key: string]: any; // Additional fields
}

// Create an axios instance for notifications API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/notifications",
  headers: new axios.AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader(); // Get the token from the helper

    // Ensure headers object exists and is of the correct type
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    // Merge the authorization headers
    for (const [key, value] of Object.entries(authHeader)) {
      config.headers.set(key, value);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        attempt++;
      } else {
        console.error("Request failed:", error); // Log error for debugging
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries."); // Ensure all paths return or throw
};

// Get all notifications for the current user
export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await axiosRetry(() =>
      apiClient.get("/user")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch notifications.");
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post(`/read/${notificationId}`));
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    throw new Error(error.response?.data?.message || "Failed to mark notification as read.");
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post("/read-all"));
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    throw new Error(error.response?.data?.message || "Failed to mark all notifications as read.");
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.delete(`/delete/${notificationId}`));
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    throw new Error(error.response?.data?.message || "Failed to delete notification.");
  }
};

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
