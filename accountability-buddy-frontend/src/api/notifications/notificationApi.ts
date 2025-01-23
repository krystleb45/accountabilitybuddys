import axios from 'axios';
import { getAuthHeader } from 'src/services/authService';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/notifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ApiErrorResponse {
  message: string;
}

// Type guard for Axios errors
const isAxiosError = (
  error: unknown
): error is { response: { data: ApiErrorResponse } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  );
};

// Helper to handle errors
const handleError = (error: unknown): never => {
  if (isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('An unknown error occurred.');
};

// Fetch all notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get<Notification[]>(`${API_URL}/user`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  try {
    const response = await axios.put<Notification>(
      `${API_URL}/${notificationId}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

export const deleteNotification = async (
  notificationId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/${notificationId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Fetch unread notifications count
export const fetchUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await axios.get<{ count: number }>(
      `${API_URL}/user/unread-count`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.count;
  } catch (error: unknown) {
    handleError(error); // This throws, ensuring no undefined is returned
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Create a new notification
export const createNotification = async (
  notificationData: Partial<Notification>
): Promise<Notification> => {
  try {
    const response = await axios.post<Notification>(
      `${API_URL}`,
      notificationData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error); // This throws, ensuring no undefined is returned
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};
