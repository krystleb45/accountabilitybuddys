import axios from 'axios';
import { getAuthHeader } from './authApi'; // Ensure that the authorization token is included in requests

const API_URL = '/api/collaboration-goals';

// Function to create a new collaboration goal
export const createCollaborationGoal = async (goalData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, goalData, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return the created goal
  } catch (error) {
    console.error('Error creating collaboration goal:', error);
    throw new Error(error.response?.data?.message || 'Failed to create collaboration goal.');
  }
};

// Function to update progress of a collaboration goal
export const updateCollaborationGoalProgress = async (goalId, progress) => {
  try {
    const response = await axios.put(`${API_URL}/${goalId}/update-progress`, { progress }, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return the updated goal
  } catch (error) {
    console.error('Error updating collaboration goal progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to update collaboration goal progress.');
  }
};

// Function to fetch all collaboration goals for the authenticated user (with pagination)
export const getUserCollaborationGoals = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/my-goals`, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
      params: { page, limit }, // Pagination parameters
    });
    return response.data; // Return the list of goals and pagination info
  } catch (error) {
    console.error('Error fetching user collaboration goals:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch collaboration goals.');
  }
};

// Function to fetch a single collaboration goal by its ID
export const getCollaborationGoalById = async (goalId) => {
  try {
    const response = await axios.get(`${API_URL}/${goalId}`, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return the goal details
  } catch (error) {
    console.error('Error fetching collaboration goal:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch collaboration goal.');
  }
};

// Function to delete a collaboration goal
export const deleteCollaborationGoal = async (goalId) => {
  try {
    const response = await axios.delete(`${API_URL}/${goalId}`, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return success message
  } catch (error) {
    console.error('Error deleting collaboration goal:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete collaboration goal.');
  }
};

