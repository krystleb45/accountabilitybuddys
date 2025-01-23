import axios from 'axios';
import { getAuthHeader } from 'src/services/authService';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/partners';

interface Partner {
  id: string;
  name: string;
  email: string;
  // Add other relevant fields as necessary
}

interface Milestone {
  title: string;
  description: string;
  dateCompleted: string;
  // Add other relevant fields as necessary
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

// Notify a partner about a milestone completion
export const notifyPartner = async (
  partnerId: string,
  goalId: string,
  milestone: Milestone
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/notify`,
      { partnerId, goalId, milestone },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Get a list of all partners
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const response = await axios.get<Partner[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Fetch specific partner information by ID
export const fetchPartnerById = async (partnerId: string): Promise<Partner> => {
  try {
    const response = await axios.get<Partner>(`${API_URL}/${partnerId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Remove a partner from the user's list
export const removePartner = async (
  partnerId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/${partnerId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Add a new partner
export const addPartner = async (
  partnerData: Partial<Partner>
): Promise<Partner> => {
  try {
    const response = await axios.post<Partner>(`${API_URL}`, partnerData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};
