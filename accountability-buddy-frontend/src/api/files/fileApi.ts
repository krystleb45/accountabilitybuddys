import axios, { AxiosProgressEvent } from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Upload a file to the server.
 * @param file - The file to upload.
 * @param onUploadProgress - Optional callback for tracking upload progress.
 * @returns The server's response data.
 */
export const uploadFile = async (
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<{ success: boolean; message: string; fileUrl?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
      onUploadProgress, // Now using the correct AxiosProgressEvent type
    });

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Helper: Get authentication headers.
 * @returns An object containing the Authorization header.
 */
const getAuthHeaders = (): { Authorization: string } => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Unauthorized');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Helper: Handle API errors.
 * @param error - The error object from Axios.
 * @returns A consistent error response.
 */
const handleApiError = (error: any): { success: boolean; message: string } => {
  console.error('API Error:', error.response || error.message);
  return {
    success: false,
    message: error.response?.data?.message || 'An unknown error occurred',
  };
};
