import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import authService from "./authService"; // Correctly use authService for token management

// Define types for support data
export interface SupportData {
  name: string;
  email: string;
  subject: string;
  message: string;
  [key: string]: any; // Additional fields
}

export interface SupportTicket {
  id: string;
  status: string; // e.g., "open", "resolved"
  createdAt: string;
  updatedAt?: string;
  [key: string]: any; // Additional fields
}

export interface TicketDetails extends SupportTicket {
  messages: Array<{ sender: string; content: string; timestamp: string }>;
}

// Create an axios instance for support API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/support",
  headers: new axios.AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Axios interceptor to automatically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }
    for (const [key, value] of Object.entries(authHeader)) {
      config.headers.set(key, value);
    }
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
        console.error("Request failed:", error);
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries.");
};

// Contact support function
export const contactSupport = async (supportData: SupportData): Promise<void> => {
  try {
    await axiosRetry(() =>
      apiClient.post("/contact", supportData)
    );
  } catch (error: any) {
    console.error("Error contacting support:", error);
    throw new Error(
      error.response?.data?.message || "Failed to contact support."
    );
  }
};

// Fetch support tickets for the user
export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  try {
    const response: AxiosResponse<SupportTicket[]> = await axiosRetry(() =>
      apiClient.get("/tickets")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching support tickets:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch support tickets."
    );
  }
};

// Get details of a specific support ticket
export const getTicketDetails = async (
  ticketId: string
): Promise<TicketDetails> => {
  try {
    const response: AxiosResponse<TicketDetails> = await axiosRetry(() =>
      apiClient.get(`/tickets/${ticketId}`)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching ticket details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch ticket details."
    );
  }
};

// Update a support ticket
export const updateSupportTicket = async (
  ticketId: string,
  updateData: Partial<SupportTicket>
): Promise<void> => {
  try {
    await axiosRetry(() =>
      apiClient.put(`/tickets/${ticketId}`, updateData)
    );
  } catch (error: any) {
    console.error("Error updating support ticket:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update support ticket."
    );
  }
};

// Export all functions as a single object
const SupportService = {
  contactSupport,
  getSupportTickets,
  getTicketDetails,
  updateSupportTicket,
};

export default SupportService;
