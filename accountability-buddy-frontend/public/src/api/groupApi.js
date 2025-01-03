import axios from 'axios';
import { getAuthHeader } from '../services/authService'; // Helper for getting the auth header with token

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle API errors
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};


// Fetch all groups
export const fetchGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch a single group by ID
export const fetchGroupById = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new group
export const createGroup = async (groupData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, groupData, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Join a group
export const joinGroup = async (groupId) => {
  try {
    const response = await axios.put(`${API_URL}/${groupId}/join`, {}, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Leave a group
export const leaveGroup = async (groupId) => {
  try {
    const response = await axios.put(`${API_URL}/${groupId}/leave`, {}, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch group members
export const fetchGroupMembers = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}/members`, {
      headers: getAuthHeader(),  // Include token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
