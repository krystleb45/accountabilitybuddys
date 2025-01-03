import axios from 'axios';
import { setToken, removeToken } from '../services/authService'; // Ensure token management is handled

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/auth';


// Helper function for error handling
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};


// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;

    if (token) {
      setToken(token); // Save token in localStorage
    }

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    const { token } = response.data;

    if (token) {
      setToken(token); // Save token upon successful registration
    }

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    removeToken(); // Remove token on logout
  } catch (error) {
    handleError(error);
  }
};
