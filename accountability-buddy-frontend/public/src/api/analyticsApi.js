import axios from 'axios';
import { getAuthHeader } from '../services/authService';  // Import the helper function for auth headers

const API_URL = 'https://accountabilitybuddys.com/api/analytics';

// Utility function to handle retries with exponential backoff
const axiosRetry = async (fn, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        attempt++;
      } else {
        throw error;
      }
    }
  }
};

// Get goal analytics for the current user
export const getGoalAnalytics = async () => {
  try {
    const response = await axiosRetry(() =>
      axios.get(`${API_URL}/goals`, {
        headers: getAuthHeader(),  // Attach Authorization header
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching goal analytics:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch goal analytics. Please try again later.'
    );
  }
};

// Get milestone analytics for the current user
export const getMilestoneAnalytics = async () => {
  try {
    const response = await axiosRetry(() =>
      axios.get(`${API_URL}/milestones`, {
        headers: getAuthHeader(),  // Attach Authorization header
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching milestone analytics:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch milestone analytics. Please try again later.'
    );
  }
};

// Fetch custom analytics data (e.g., monthly, weekly progress)
export const getCustomAnalytics = async (filters) => {
  try {
    const response = await axiosRetry(() =>
      axios.post(`${API_URL}/custom`, filters, {
        headers: getAuthHeader(),  // Attach Authorization header
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching custom analytics:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch custom analytics. Please try again later.'
    );
  }
};
