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

// Fetch the user's profile
export const getUserProfile = async (): Promise<UserProfile | undefined> => {
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/profile`, {
      headers: getAuthHeader(), // Include the authorization token in headers
    });
    return response.data; // Assuming response contains user profile data
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Update the user's profile
export const updateUserProfile = async (
  profileData: Partial<UserProfile>
): Promise<UserProfile | undefined> => {
  try {
    const response = await axios.put<UserProfile>(
      `${API_URL}/profile/update`,
      profileData,
      {
        headers: {
          ...getAuthHeader(), // Include the authorization token in headers
          'Content-Type': 'application/json', // Ensure content type is set for JSON requests
        },
      }
    );
    return response.data; // Assuming response contains updated profile data
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Update user password
export const updatePassword = async (
  passwordData: PasswordData
): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.put<{ message: string }>(
      `${API_URL}/password/update`,
      passwordData,
      {
        headers: getAuthHeader(), // Include the authorization token in headers
      }
    );
    return response.data; // Assuming response contains a success message
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Fetch user's activity logs
export const getUserActivityLogs = async (): Promise<any[] | undefined> => {
  try {
    const response = await axios.get<any[]>(`${API_URL}/activity-logs`, {
      headers: getAuthHeader(), // Include the authorization token in headers
    });
    return response.data; // Assuming response contains activity log data
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Delete the user's account
export const deleteUserAccount = async (): Promise<
  { message: string } | undefined
> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/delete`,
      {
        headers: getAuthHeader(), // Include the authorization token in headers
      }
    );
    return response.data; // Assuming response contains confirmation of account deletion
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
