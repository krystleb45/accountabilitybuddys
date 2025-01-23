import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Ensure token is included in requests

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

// Define the structure of Support Data
interface SupportData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define the structure of a Support Ticket
interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  messages: Array<{ sender: string; content: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
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

// Contact support with a message
export const contactSupport = async (
  supportData: SupportData
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/contact`,
      supportData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Assuming response contains a confirmation message
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Get all support tickets submitted by the user
export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  try {
    const response = await axios.get<SupportTicket[]>(`${API_URL}/tickets`, {
      headers: getAuthHeader(),
    });
    return response.data; // Assuming response contains an array of support tickets
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Get details of a specific support ticket
export const getSupportTicketDetails = async (
  ticketId: string
): Promise<SupportTicket> => {
  try {
    const response = await axios.get<SupportTicket>(
      `${API_URL}/tickets/${ticketId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Assuming response contains the details of a specific support ticket
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Reply to a specific support ticket
export const replyToSupportTicket = async (
  ticketId: string,
  message: string
): Promise<SupportTicket> => {
  try {
    const response = await axios.post<SupportTicket>(
      `${API_URL}/tickets/${ticketId}/reply`,
      { message },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Assuming response contains the updated ticket with the new message
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};
