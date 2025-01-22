import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Ensure the token is included in requests

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

// Define the structure of a Subscription Plan
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  // Add more fields as needed based on your API
}

// Define the structure of a Subscription Status
interface SubscriptionStatus {
  isActive: boolean;
  currentPlan: string;
  renewalDate: string;
  // Add more fields as needed
}

// Helper function to handle API errors
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(
    error.response?.data?.message ||
      'An error occurred. Please try again later.'
  );
};

// Fetch available subscription plans
export const fetchSubscriptionPlans = async (): Promise<
  SubscriptionPlan[] | undefined
> => {
  try {
    const response = await axios.get<SubscriptionPlan[]>(`${API_URL}/plans`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Create a new subscription session
export const createSubscriptionSession = async (
  planId: string,
  provider: string = 'stripe'
): Promise<{ sessionUrl: string } | undefined> => {
  try {
    const response = await axios.post<{ sessionUrl: string }>(
      `${API_URL}/subscribe`,
      { planId, provider },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data; // Typically returns the session URL for Stripe checkout
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Fetch the user's current subscription status
export const getSubscriptionStatus = async (): Promise<
  SubscriptionStatus | undefined
> => {
  try {
    const response = await axios.get<SubscriptionStatus>(`${API_URL}/status`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Cancel the user's active subscription
export const cancelSubscription = async (): Promise<
  { message: string } | undefined
> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/cancel`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Change the user's subscription plan
export const changeSubscriptionPlan = async (
  newPlanId: string
): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/change-plan`,
      { newPlanId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};
