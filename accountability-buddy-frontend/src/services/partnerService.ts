import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Use the helper function for getting the token

// Define types for partners and requests
export interface Partner {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // Additional partner fields
}

export interface Milestone {
  id: string;
  description: string;
  date: string; // ISO date string
  [key: string]: any; // Additional milestone fields
}

// Create an axios instance for partners API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/partners",
  headers: new axios.AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader(); // Fetch the token

    // Ensure headers object exists and is of the correct type
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    // Add authorization headers
    for (const [key, value] of Object.entries(authHeader)) {
      config.headers.set(key, value);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries for axios requests with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      // Only retry for server errors (status code >= 500)
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error("Request failed:", error); // Log the error for debugging
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries.");
};

// Notify a partner about a milestone
export const notifyPartner = async (
  partnerId: string,
  goal: string,
  milestone: Milestone
): Promise<void> => {
  try {
    await axiosRetry(() =>
      apiClient.post("/notify", { partnerId, goal, milestone })
    );
  } catch (error: any) {
    console.error("Error notifying partner:", error);
    throw new Error(error.response?.data?.message || "Failed to notify partner.");
  }
};

// Fetch the list of partners
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const response: AxiosResponse<Partner[]> = await axiosRetry(() =>
      apiClient.get("/list")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching partners:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch partners.");
  }
};

// Send a partner request
export const sendPartnerRequest = async (partnerId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post("/request", { partnerId }));
  } catch (error: any) {
    console.error("Error sending partner request:", error);
    throw new Error(
      error.response?.data?.message || "Failed to send partner request."
    );
  }
};

// Accept a partner request
export const acceptPartnerRequest = async (requestId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post(`/accept/${requestId}`));
  } catch (error: any) {
    console.error("Error accepting partner request:", error);
    throw new Error(
      error.response?.data?.message || "Failed to accept partner request."
    );
  }
};

// Decline a partner request
export const declinePartnerRequest = async (requestId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post(`/decline/${requestId}`));
  } catch (error: any) {
    console.error("Error declining partner request:", error);
    throw new Error(
      error.response?.data?.message || "Failed to decline partner request."
    );
  }
};

// Export all functions
export default {
  notifyPartner,
  fetchPartners,
  sendPartnerRequest,
  acceptPartnerRequest,
  declinePartnerRequest,
};
