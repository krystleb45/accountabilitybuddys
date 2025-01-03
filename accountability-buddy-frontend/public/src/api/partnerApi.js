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


// Notify a partner about a milestone completion
export const notifyPartner = async (partnerId, goalId, milestone) => {
  try {
    const response = await axios.post(`${API_URL}/notify`, {
      partnerId,
      goalId,
      milestone,
    }, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get a list of all partners
export const fetchPartners = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch specific partner information by ID
export const fetchPartnerById = async (partnerId) => {
  try {
    const response = await axios.get(`${API_URL}/${partnerId}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Remove a partner from the user's list
export const removePartner = async (partnerId) => {
  try {
    const response = await axios.delete(`${API_URL}/${partnerId}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add a new partner (for future partner management features)
export const addPartner = async (partnerData) => {
  try {
    const response = await axios.post(`${API_URL}`, partnerData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
