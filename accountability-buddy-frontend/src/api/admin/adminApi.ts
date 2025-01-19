import axios from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Fetch all users (Admin only).
 * @returns A list of users.
 */
export const getAllUsers = async () => {
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
export const updateUserRole = async (userId: string, role: string) => {
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
export const deleteUser = async (userId: string) => {
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
export const getApplicationStats = async () => {
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
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Unauthorized');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Helper: Handle API errors.
 */
const handleApiError = (error: any) => {
  console.error('API Error:', error.response || error.message);
  throw error.response?.data || { message: 'An unknown error occurred' };
};
