import axios from "axios";
import { getAuthHeader } from "../services/authService"; // Helper to get auth header with token

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/users";

// Define the shape of a Notification
interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  // Add more fields as needed based on your API
}

// Helper function to handle errors
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error("Invalid credentials. Please try again.");
  }
  throw new Error(
    error.response?.data?.message || "An error occurred. Please try again later."
  );
};

// Fetch all notifications for the current user
export const fetchNotifications = async (): Promise<Notification[] | undefined> => {
  try {
    const response = await axios.get<Notification[]>(`${API_URL}/user`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<Notification | undefined> => {
  try {
    const response = await axios.put<Notification>(
      `${API_URL}/${notificationId}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${notificationId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Fetch unread notifications count
export const fetchUnreadNotificationCount = async (): Promise<number | undefined> => {
  try {
    const response = await axios.get<{ count: number }>(`${API_URL}/user/unread-count`, {
      headers: getAuthHeader(),
    });
    return response.data.count;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Create a new notification
export const createNotification = async (
  notificationData: Partial<Notification>
): Promise<Notification | undefined> => {
  try {
    const response = await axios.post<Notification>(`${API_URL}`, notificationData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
