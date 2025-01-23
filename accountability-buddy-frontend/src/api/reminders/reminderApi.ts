import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Ensure the token is included in requests

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

// Define the structure of a Reminder
interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  isEnabled: boolean;
}

// Define the structure of an API error response
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

// Helper function to handle API errors
const handleError = (error: unknown): never => {
  if (isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('An unknown error occurred.');
};

// Fetch all reminders for the user
export const fetchReminders = async (): Promise<Reminder[]> => {
  try {
    const response = await axios.get<Reminder[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Create a new reminder
export const createReminder = async (
  reminderData: Partial<Reminder>
): Promise<Reminder> => {
  try {
    const response = await axios.post<Reminder>(`${API_URL}`, reminderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Update an existing reminder
export const updateReminder = async (
  reminderId: string,
  reminderData: Partial<Reminder>
): Promise<Reminder> => {
  try {
    const response = await axios.put<Reminder>(
      `${API_URL}/${reminderId}`,
      reminderData,
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

// Disable a reminder
export const disableReminder = async (
  reminderId: string
): Promise<Reminder> => {
  try {
    const response = await axios.put<Reminder>(
      `${API_URL}/${reminderId}/disable`,
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

// Delete a reminder
export const deleteReminder = async (
  reminderId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/${reminderId}`,
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
