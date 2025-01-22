import axios, {
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import authService from './authService'; // Use the helper function for getting the token

// Define types for partners and milestones
export interface Partner {
  id: string;
  name: string;
  email: string;
  joinedAt?: string; // Optional date when the partner joined
  [key: string]: any; // Additional partner fields
}

export interface Milestone {
  id: string;
  description: string;
  date: string; // ISO date string
  status?: string; // Optional status (e.g., "completed", "pending")
  [key: string]: any; // Additional milestone fields
}

// Create an axios instance for partners API
const apiClient = axios.create({
  baseURL: 'https://accountabilitybuddys.com/api/partners',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();

    if (!config.headers) {
      config.headers = {} as AxiosHeaders;
    }

    Object.entries(authHeader).forEach(([key, value]) => {
      config.headers[key] = value as string;
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error('Request failed:', error);
        throw new Error(
          error.response?.data?.message ||
            'An error occurred. Please try again.'
        );
      }
    }
  }
  throw new Error('Failed after multiple retries.');
};

// Notify a partner about a milestone
export const notifyPartner = async (
  partnerId: string,
  goal: string,
  milestone: Milestone
): Promise<void> => {
  if (!partnerId || !goal || !milestone) {
    throw new Error('Partner ID, goal, and milestone data are required.');
  }

  try {
    await axiosRetry(() =>
      apiClient.post('/notify', { partnerId, goal, milestone })
    );
    console.log(`Partner ${partnerId} notified about milestone.`);
  } catch (error: any) {
    console.error('Error notifying partner:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to notify partner.'
    );
  }
};

// Fetch the list of partners
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const response: AxiosResponse<Partner[]> = await axiosRetry(() =>
      apiClient.get('/list')
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching partners:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch partners.'
    );
  }
};

// Send a partner request
export const sendPartnerRequest = async (partnerId: string): Promise<void> => {
  if (!partnerId) {
    throw new Error('Partner ID is required to send a request.');
  }

  try {
    await axiosRetry(() => apiClient.post('/request', { partnerId }));
    console.log(`Partner request sent to ${partnerId}.`);
  } catch (error: any) {
    console.error('Error sending partner request:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to send partner request.'
    );
  }
};

// Accept a partner request
export const acceptPartnerRequest = async (
  requestId: string
): Promise<void> => {
  if (!requestId) {
    throw new Error('Request ID is required to accept a partner request.');
  }

  try {
    await axiosRetry(() => apiClient.post(`/accept/${requestId}`));
    console.log(`Partner request ${requestId} accepted.`);
  } catch (error: any) {
    console.error('Error accepting partner request:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to accept partner request.'
    );
  }
};

// Decline a partner request
export const declinePartnerRequest = async (
  requestId: string
): Promise<void> => {
  if (!requestId) {
    throw new Error('Request ID is required to decline a partner request.');
  }

  try {
    await axiosRetry(() => apiClient.post(`/decline/${requestId}`));
    console.log(`Partner request ${requestId} declined.`);
  } catch (error: any) {
    console.error('Error declining partner request:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to decline partner request.'
    );
  }
};

// Export all functions
const PartnerService = {
  notifyPartner,
  fetchPartners,
  sendPartnerRequest,
  acceptPartnerRequest,
  declinePartnerRequest,
};

export default PartnerService;
