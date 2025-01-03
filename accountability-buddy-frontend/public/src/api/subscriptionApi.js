import axios from 'axios';
import { getAuthHeader } from '../services/authService';  // Ensure the token is included in requests

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com/users';


// Helper function to handle API errors
const handleError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(error.response?.data?.message || 'An error occurred. Please try again later.');
};


// Fetch available subscription plans
export const fetchSubscriptionPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/plans`, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new subscription session
export const createSubscriptionSession = async (planId, provider = 'stripe') => {
  try {
    const response = await axios.post(`${API_URL}/subscribe`, { planId, provider }, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;  // Typically returns the session URL for Stripe checkout
  } catch (error) {
    handleError(error);
  }
};

// Fetch the user's current subscription status
export const getSubscriptionStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Cancel the user's active subscription
export const cancelSubscription = async () => {
  try {
    const response = await axios.post(`${API_URL}/cancel`, {}, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Change the user's subscription plan
export const changeSubscriptionPlan = async (newPlanId) => {
  try {
    const response = await axios.post(`${API_URL}/change-plan`, { newPlanId }, {
      headers: getAuthHeader(),  // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
