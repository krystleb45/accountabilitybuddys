import axios from "axios";
import { getAuthHeader } from "../services/authService"; // Ensure the token is included in requests

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/users";

// Define the structure of a Reminder
interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  isEnabled: boolean;
  // Add more fields as needed based on your API
}

// Helper function to handle API errors
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error("Invalid credentials. Please try again.");
  }
  throw new Error(
    error.response?.data?.message || "An error occurred. Please try again later."
  );
};

// Fetch all reminders for the user
export const fetchReminders = async (): Promise<Reminder[] | undefined> => {
  try {
    const response = await axios.get<Reminder[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Create a new reminder
export const createReminder = async (reminderData: Partial<Reminder>): Promise<Reminder | undefined> => {
  try {
    const response = await axios.post<Reminder>(`${API_URL}`, reminderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Update an existing reminder
export const updateReminder = async (reminderId: string, reminderData: Partial<Reminder>): Promise<Reminder | undefined> => {
  try {
    const response = await axios.put<Reminder>(`${API_URL}/${reminderId}`, reminderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Disable a reminder
export const disableReminder = async (reminderId: string): Promise<Reminder | undefined> => {
  try {
    const response = await axios.put<Reminder>(
      `${API_URL}/${reminderId}/disable`,
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

// Delete a reminder
export const deleteReminder = async (reminderId: string): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${reminderId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
