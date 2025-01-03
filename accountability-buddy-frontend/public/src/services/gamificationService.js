import axios from 'axios';

// Base API URL (use environment variables for flexibility)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com'; // Replace with actual base URL

// Fetch badges for a specific user from the backend
export const fetchBadges = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/badges`, {
      headers: getAuthHeader(), // Include authentication headers if required
    });
    return response.data; // Return array of badges
  } catch (error) {
    handleError('fetchBadges', error);
    return []; // Return empty array in case of error
  }
};

// Fetch user progress from the backend
export const fetchUserProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/progress`, {
      headers: getAuthHeader(),
    });
    return response.data.progress; // Return progress value (0-100)
  } catch (error) {
    handleError('fetchUserProgress', error);
    return 0; // Return 0 in case of error
  }
};

// Fetch leaderboard data from backend
export const fetchLeaderboard = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard?userId=${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data; // Return array of users with points
  } catch (error) {
    handleError('fetchLeaderboard', error);
    return []; // Return empty array in case of error
  }
};

// Helper function to get authentication headers (if needed)
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Centralized error handling
const handleError = (functionName, error) => {
  console.error(`Error in ${functionName}:`, error.message);

  if (error.response) {
    console.error(`Server responded with status: ${error.response.status}`, error.response.data);
  } else if (error.request) {
    console.error('Request made, but no response received.');
  } else {
    console.error('Error setting up the request.');
  }
};

export default {
  fetchBadges,
  fetchUserProgress,
  fetchLeaderboard,
};
