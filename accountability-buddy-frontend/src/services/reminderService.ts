import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import authService from './authService'; // Centralized token management

// Define types for reminders
export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  isCompleted?: boolean; // Optional field to track completion status
  [key: string]: any; // Additional fields
}

// Create an axios instance for reminders API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/reminders',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically add the Authorization header to every request
// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();

    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    Object.entries(authHeader).forEach(([key, value]) => {
      config.headers.set(key, value as string);
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries for axios requests with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error('Request failed:', error);
        throw new Error(
          error.response?.data?.message ||
            'An error occurred. Please try again.'
        );
      }
    }
  }
  throw new Error('Failed after multiple retries.');
};

// Set a new reminder
export const setReminder = async (
  reminderData: Partial<Reminder>
): Promise<Reminder> => {
  if (!reminderData || !reminderData.title || !reminderData.date) {
    throw new Error('Reminder data must include a title and date.');
  }

  try {
    const response: AxiosResponse<Reminder> = await axiosRetry(() =>
      apiClient.post('/create', reminderData)
    );
    console.log('Reminder created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error setting reminder:', error);
    throw new Error(error.response?.data?.message || 'Failed to set reminder.');
  }
};

// Update an existing reminder
export const updateReminder = async (
  reminderId: string,
  reminderData: Partial<Reminder>
): Promise<Reminder> => {
  if (!reminderId) {
    throw new Error('Reminder ID is required to update a reminder.');
  }

  try {
    const response: AxiosResponse<Reminder> = await axiosRetry(() =>
      apiClient.put(`/update/${reminderId}`, reminderData)
    );
    console.log('Reminder updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating reminder:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to update reminder.'
    );
  }
};

// Fetch all reminders for the user
export const fetchReminders = async (): Promise<Reminder[]> => {
  try {
    const response: AxiosResponse<Reminder[]> = await axiosRetry(() =>
      apiClient.get('/list')
    );
    console.log('Reminders fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch reminders.'
    );
  }
};

// Delete a reminder
export const deleteReminder = async (reminderId: string): Promise<void> => {
  if (!reminderId) {
    throw new Error('Reminder ID is required to delete a reminder.');
  }

  try {
    await axiosRetry(() => apiClient.delete(`/delete/${reminderId}`));
    console.log(`Reminder with ID ${reminderId} deleted successfully.`);
  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to delete reminder.'
    );
  }
};

// Mark a reminder as completed
export const completeReminder = async (reminderId: string): Promise<void> => {
  if (!reminderId) {
    throw new Error('Reminder ID is required to mark as completed.');
  }

  try {
    await axiosRetry(() => apiClient.post(`/complete/${reminderId}`));
    console.log(`Reminder with ID ${reminderId} marked as completed.`);
  } catch (error: any) {
    console.error('Error completing reminder:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to complete reminder.'
    );
  }
};

// Export all functions
const ReminderService = {
  setReminder,
  updateReminder,
  fetchReminders,
  deleteReminder,
  completeReminder,
};

export default ReminderService;
