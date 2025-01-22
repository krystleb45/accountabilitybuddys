import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Helper to get the Authorization header

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

// Define the structure of a Partner
interface Partner {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed based on your API
}

// Define the structure of a Milestone
interface Milestone {
  title: string;
  description: string;
  dateCompleted: string;
  // Add more fields as needed
}

// Helper function to handle API errors
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(
    error.response?.data?.message ||
      'An error occurred. Please try again later.'
  );
};

// Notify a partner about a milestone completion
export const notifyPartner = async (
  partnerId: string,
  goalId: string,
  milestone: Milestone
): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/notify`,
      {
        partnerId,
        goalId,
        milestone,
      },
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

// Get a list of all partners
export const fetchPartners = async (): Promise<Partner[] | undefined> => {
  try {
    const response = await axios.get<Partner[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Fetch specific partner information by ID
export const fetchPartnerById = async (
  partnerId: string
): Promise<Partner | undefined> => {
  try {
    const response = await axios.get<Partner>(`${API_URL}/${partnerId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Remove a partner from the user's list
export const removePartner = async (
  partnerId: string
): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/${partnerId}`,
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

// Add a new partner (for future partner management features)
export const addPartner = async (
  partnerData: Partial<Partner>
): Promise<Partner | undefined> => {
  try {
    const response = await axios.post<Partner>(`${API_URL}`, partnerData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
