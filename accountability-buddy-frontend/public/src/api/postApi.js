import axios from 'axios';
import { getAuthHeader } from '../services/authService'; // Helper to get the Authorization header

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle API errors
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};

// Fetch all posts (e.g., for the user’s feed)
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch a specific post by ID
export const fetchPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}`, postData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update an existing post
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}`, postData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/like`, {}, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Comment on a post
export const commentOnPost = async (postId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/comment`, commentData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
