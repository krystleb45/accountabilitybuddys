import axios from 'axios';
import { getAuthHeader } from '../services/authService';  // Helper for getting the auth header with the token

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle API errors
const handleError = (error) => {
  const message = error.response?.data?.message || 'An error occurred. Please try again later.';
  throw new Error(message);
};

// Get all feed posts
export const getFeedPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);  // Improved error handling
  }
};

// Create a new feed post
export const createFeedPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, postData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Like a feed post
export const likeFeedPost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}/like`, {}, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Unlike a feed post
export const unlikeFeedPost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}/unlike`, {}, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Comment on a feed post
export const commentOnFeedPost = async (postId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/comment`, commentData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
