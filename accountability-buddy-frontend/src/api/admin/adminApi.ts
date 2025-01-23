import axios from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Fetch all users (Admin only).
 * @returns A list of users.
 */
export const getAllUsers = async (): Promise<unknown> => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Update a user's role (Admin only).
 * @param userId - The ID of the user to update.
 * @param role - The new role for the user.
 * @returns The updated user.
 */
export const updateUserRole = async (
  userId: string,
  role: string
): Promise<unknown> => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/role`,
      { role },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Delete a user by ID (Admin only).
 * @param userId - The ID of the user to delete.
 * @returns A success message.
 */
export const deleteUser = async (userId: string): Promise<unknown> => {
  try {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetch application statistics (Admin only).
 * @returns Statistics about the application.
 */
export const getApplicationStats = async (): Promise<unknown> => {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Helper: Get authentication headers.
 */
const getAuthHeaders = (): { Authorization: string } => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Unauthorized');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Helper: Check if an error is an Axios error.
 */
const isAxiosError = (
  error: unknown
): error is { response: { data: { message: string } } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    'data' in (error as { response: { data?: unknown } }).response
  );
};

/**
 * Helper: Handle API errors.
 */
const handleApiError = (error: unknown): void => {
  if (isAxiosError(error)) {
    console.error('API Error:', error.response.data.message);
    throw new Error(error.response.data.message);
  } else if (error instanceof Error) {
    console.error('Error:', error.message);
    throw new Error(error.message);
  } else {
    console.error('Unknown error:', error);
    throw new Error('An unknown error occurred');
  }
};
