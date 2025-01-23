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
}

// Define the structure of a Subscription Status
interface SubscriptionStatus {
  isActive: boolean;
  currentPlan: string;
  renewalDate: string;
}

// Define the structure of an API error response
interface ApiErrorResponse {
  message: string;
}

// Type guard for Axios errors
const isAxiosError = (
  error: unknown
): error is { response: { data: ApiErrorResponse } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  );
};

// Helper function to handle API errors
const handleError = (error: unknown): never => {
  if (isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error('An unknown error occurred.');
};

// Fetch available subscription plans
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await axios.get<SubscriptionPlan[]>(`${API_URL}/plans`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Create a new subscription session
export const createSubscriptionSession = async (
  planId: string,
  provider: string = 'stripe'
): Promise<{ sessionUrl: string }> => {
  try {
    const response = await axios.post<{ sessionUrl: string }>(
      `${API_URL}/subscribe`,
      { planId, provider },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Fetch the user's current subscription status
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const response = await axios.get<SubscriptionStatus>(`${API_URL}/status`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Cancel the user's active subscription
export const cancelSubscription = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/cancel`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Change the user's subscription plan
export const changeSubscriptionPlan = async (
  newPlanId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/change-plan`,
      { newPlanId },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};
