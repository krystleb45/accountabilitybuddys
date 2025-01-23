import axios, { AxiosProgressEvent } from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Upload a file to the server.
 * @param file - The file to upload.
 * @param onUploadProgress - Optional callback for tracking upload progress.
 * @returns The server's response data or throws an error.
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
      onUploadProgress,
    });

    return response.data;
  } catch (error: unknown) {
    // Throw the error to handle it explicitly where the function is used
    throw handleApiError(error);
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
 * @param error - The error object from Axios or unknown.
 * @returns A consistent error response object or throws an error.
 */
const handleApiError = (
  error: unknown
): { success: boolean; message: string } => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    console.error('API Error:', error.response.data.message);
    return {
      success: false,
      message: error.response.data.message,
    };
  } else if (error instanceof Error) {
    console.error('API Error:', error.message);
    return {
      success: false,
      message: error.message,
    };
  } else {
    console.error('Unknown API Error:', error);
    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
};
