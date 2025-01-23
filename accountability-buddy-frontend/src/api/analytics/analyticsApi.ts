import axios from 'axios';
import { getAuthHeader } from '../../services/authService'; // Import the helper function for auth headers

const API_URL = 'https://accountabilitybuddys.com/api/analytics';

// Interface for custom analytics filters
interface CustomAnalyticsFilters {
  startDate: string;
  endDate: string;
  [key: string]: unknown; // Additional filter properties can be added as needed
}

// Interface for goal and milestone analytics response
interface AnalyticsResponse {
  data: unknown; // Replace 'unknown' with the actual shape of your analytics data if known
}

// Utility function to check if the error is an Axios error
// Utility function to check if the error is an Axios error
const isAxiosError = (
  error: unknown
): error is {
  response: {
    status: number;
    data: { message: string };
  };
} => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    'data' in (error as { response: { data?: unknown } }).response
  );
};

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (
        attempt < retries - 1 &&
        isAxiosError(error) &&
        error.response?.status >= 500
      ) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries reached');
};

// Get goal analytics for the current user
export const getGoalAnalytics = async (): Promise<AnalyticsResponse> => {
  try {
    const response = await axiosRetry(() =>
      axios.get<AnalyticsResponse>(`${API_URL}/goals`, {
        headers: getAuthHeader(), // Attach Authorization header
      })
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching goal analytics:',
        error.response.data.message
      );
      throw new Error(error.response.data.message);
    } else {
      console.error('Unknown error fetching goal analytics:', error);
      throw new Error(
        'Failed to fetch goal analytics. Please try again later.'
      );
    }
  }
};

// Get milestone analytics for the current user
export const getMilestoneAnalytics = async (): Promise<AnalyticsResponse> => {
  try {
    const response = await axiosRetry(() =>
      axios.get<AnalyticsResponse>(`${API_URL}/milestones`, {
        headers: getAuthHeader(), // Attach Authorization header
      })
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching milestone analytics:',
        error.response.data.message
      );
      throw new Error(error.response.data.message);
    } else {
      console.error('Unknown error fetching milestone analytics:', error);
      throw new Error(
        'Failed to fetch milestone analytics. Please try again later.'
      );
    }
  }
};

// Fetch custom analytics data (e.g., monthly, weekly progress)
export const getCustomAnalytics = async (
  filters: CustomAnalyticsFilters
): Promise<AnalyticsResponse> => {
  try {
    const response = await axiosRetry(() =>
      axios.post<AnalyticsResponse>(`${API_URL}/custom`, filters, {
        headers: getAuthHeader(), // Attach Authorization header
      })
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching custom analytics:',
        error.response.data.message
      );
      throw new Error(error.response.data.message);
    } else {
      console.error('Unknown error fetching custom analytics:', error);
      throw new Error(
        'Failed to fetch custom analytics. Please try again later.'
      );
    }
  }
};
