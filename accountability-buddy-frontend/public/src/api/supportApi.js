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


// Contact support with a message
export const contactSupport = async (supportData) => {
  try {
    const response = await axios.post(`${API_URL}/contact`, supportData, {
      headers: getAuthHeader(),  // Include the token in the headers if necessary
    });
    return response.data;  // Assuming response contains a confirmation message
  } catch (error) {
    handleError(error);
  }
};

// Get all support tickets submitted by the user
export const getSupportTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tickets`, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;  // Assuming response contains an array of support tickets
  } catch (error) {
    handleError(error);
  }
};

// Get details of a specific support ticket
export const getSupportTicketDetails = async (ticketId) => {
  try {
    const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;  // Assuming response contains the details of a specific support ticket
  } catch (error) {
    handleError(error);
  }
};

// Reply to a specific support ticket
export const replyToSupportTicket = async (ticketId, message) => {
  try {
    const response = await axios.post(`${API_URL}/tickets/${ticketId}/reply`, { message }, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;  // Assuming response contains the updated ticket with the new message
  } catch (error) {
    handleError(error);
  }
};
