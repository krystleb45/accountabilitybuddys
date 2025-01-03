import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Ensure token management is handled centrally

// Define types for reminders
export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  [key: string]: any; // Additional fields
}

// Create an axios instance for reminders API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/reminders",
  headers: new axios.AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }
    for (const [key, value] of Object.entries(authHeader)) {
      config.headers.set(key, value);
    }
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
      // Only retry for server errors (status code >= 500)
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error("Request failed:", error); // Log the error for debugging
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries.");
};

// Set a new reminder
export const setReminder = async (reminderData: Partial<Reminder>): Promise<Reminder> => {
  try {
    const response: AxiosResponse<Reminder> = await axiosRetry(() =>
      apiClient.post("/create", reminderData)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error setting reminder:", error);
    throw new Error(error.response?.data?.message || "Failed to set reminder.");
  }
};

// Update an existing reminder
export const updateReminder = async (
  reminderId: string,
  reminderData: Partial<Reminder>
): Promise<Reminder> => {
  try {
    const response: AxiosResponse<Reminder> = await axiosRetry(() =>
      apiClient.put(`/update/${reminderId}`, reminderData)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating reminder:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update reminder."
    );
  }
};

// Fetch all reminders for the user
export const fetchReminders = async (): Promise<Reminder[]> => {
  try {
    const response: AxiosResponse<Reminder[]> = await axiosRetry(() =>
      apiClient.get("/list")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching reminders:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch reminders."
    );
  }
};

// Delete a reminder
export const deleteReminder = async (reminderId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.delete(`/delete/${reminderId}`));
  } catch (error: any) {
    console.error("Error deleting reminder:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete reminder."
    );
  }
};

// Export all functions
export default {
  setReminder,
  updateReminder,
  fetchReminders,
  deleteReminder,
};
