import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Ensure token is included in requests

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

// Define the structure of User Profile Data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed based on your API
}

// Define the structure for updating password data
interface PasswordData {
  currentPassword: string;
  newPassword: string;
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

// Fetch the user's profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/profile`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Update the user's profile
export const updateUserProfile = async (
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const response = await axios.put<UserProfile>(
      `${API_URL}/profile/update`,
      profileData,
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Update user password
export const updatePassword = async (
  passwordData: PasswordData
): Promise<{ message: string }> => {
  try {
    const response = await axios.put<{ message: string }>(
      `${API_URL}/password/update`,
      passwordData,
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

// Fetch user's activity logs
export const getUserActivityLogs = async (): Promise<unknown[]> => {
  try {
    const response = await axios.get<unknown[]>(`${API_URL}/activity-logs`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Delete the user's account
export const deleteUserAccount = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/delete`,
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
