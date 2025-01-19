import axios from "axios";
import { getAuthHeader } from "src/services/authService"; // Ensure token is included in requests

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/users";

// Define the structure of Support Data
interface SupportData {
  name: string;
  email: string;
  subject: string;
  message: string;
  // Add more fields as needed based on your API requirements
}

// Define the structure of a Support Ticket
interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  messages: Array<{ sender: string; content: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
  // Add more fields as needed
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

// Contact support with a message
export const contactSupport = async (
  supportData: SupportData
): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/contact`,
      supportData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Assuming response contains a confirmation message
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Get all support tickets submitted by the user
export const getSupportTickets = async (): Promise<SupportTicket[] | undefined> => {
  try {
    const response = await axios.get<SupportTicket[]>(`${API_URL}/tickets`, {
      headers: getAuthHeader(),
    });
    return response.data; // Assuming response contains an array of support tickets
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Get details of a specific support ticket
export const getSupportTicketDetails = async (
  ticketId: string
): Promise<SupportTicket | undefined> => {
  try {
    const response = await axios.get<SupportTicket>(
      `${API_URL}/tickets/${ticketId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Assuming response contains the details of a specific support ticket
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Reply to a specific support ticket
export const replyToSupportTicket = async (
  ticketId: string,
  message: string
): Promise<SupportTicket | undefined> => {
  try {
    const response = await axios.post<SupportTicket>(
      `${API_URL}/tickets/${ticketId}/reply`,
      { message },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Assuming response contains the updated ticket with the new message
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};
