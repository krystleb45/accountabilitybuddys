import axios from 'axios';
import { getAuthHeader } from '../services/authService';  // Ensure token is included in requests

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle API errors
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};


// Fetch the user's profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: getAuthHeader(),  // Include the authorization token in headers
    });
    return response.data;  // Assuming response contains user profile data
  } catch (error) {
    handleError(error);
  }
};

// Update the user's profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile/update`, profileData, {
      headers: {
        ...getAuthHeader(),  // Include the authorization token in headers
        'Content-Type': 'application/json',  // Ensure content type is set for JSON requests
      },
    });
    return response.data;  // Assuming response contains updated profile data
  } catch (error) {
    handleError(error);
  }
};

// Update user password
export const updatePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_URL}/password/update`, passwordData, {
      headers: getAuthHeader(),  // Include the authorization token in headers
    });
    return response.data;  // Assuming response contains a success message
  } catch (error) {
    handleError(error);
  }
};

// Fetch user's activity logs
export const getUserActivityLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/activity-logs`, {
      headers: getAuthHeader(),  // Include the authorization token in headers
    });
    return response.data;  // Assuming response contains activity log data
  } catch (error) {
    handleError(error);
  }
};

// Delete the user's account
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      headers: getAuthHeader(),  // Include the authorization token in headers
    });
    return response.data;  // Assuming response contains confirmation of account deletion
  } catch (error) {
    handleError(error);
  }
};
