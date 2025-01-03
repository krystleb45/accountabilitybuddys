import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Define base API URL
const API_URL = "https://accountabilitybuddys.com/api";

// Define types for API responses
export interface DashboardData {
  widgets: any[];
  statistics: any[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface FeedPost {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  author: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

// Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding authorization tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function for handling errors
const handleApiError = (error: any, defaultMessage: string): never => {
  console.error(error);
  throw new Error(error.response?.data?.message || defaultMessage);
};

// Fetch dashboard data
// Fetch dashboard data
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response: AxiosResponse<DashboardData> = await apiClient.get<DashboardData>("/dashboard");
    return response.data; // Return the parsed data
  } catch (error: any) {
    handleApiError(error, "Failed to fetch dashboard data.");
    return Promise.reject(error); // Explicitly reject the Promise in case of error
  }
};

// Fetch user data
export const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const response: AxiosResponse<UserData> = await apiClient.get<UserData>(`/users/${userId}`);
    return response.data; // Return the parsed data
  } catch (error: any) {
    handleApiError(error, "Failed to fetch user data.");
    return Promise.reject(error); // Explicitly reject the Promise in case of error
  }
};

// Create a task
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    const response: AxiosResponse<Task> = await apiClient.post<Task>("/tasks", taskData);
    return response.data; // Return the parsed data
  } catch (error: any) {
    handleApiError(error, "Failed to create task.");
    return Promise.reject(error); // Explicitly reject the Promise in case of error
  }
};


// Fetch feed posts
export const getFeed = async (): Promise<FeedPost[]> => {
  try {
    const response: AxiosResponse<FeedPost[]> = await apiClient.get<FeedPost[]>("/feed");
    return response.data; // Ensure `data` is an array of `FeedPost`.
  } catch (error: any) {
    handleApiError(error, "Failed to fetch feed.");
    return []; // Return a fallback empty array if an error occurs.
  }
};


// Create a new post
export const createPost = async (content: string): Promise<FeedPost> => {
  try {
    const response: AxiosResponse<FeedPost> = await apiClient.post<FeedPost>("/posts", { content });
    return response.data; // Return the parsed post data
  } catch (error: any) {
    handleApiError(error, "Failed to create post.");
    return Promise.reject(error); // Explicitly reject the Promise to maintain a consistent error flow
  }
};


// Like a post
export const likePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.post(`/posts/${postId}/like`);
  } catch (error: any) {
    handleApiError(error, "Failed to like post.");
  }
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.post(`/posts/${postId}/unlike`);
  } catch (error: any) {
    handleApiError(error, "Failed to unlike post.");
  }
};

// Add a comment to a post
export const addComment = async (postId: string, commentText: string): Promise<Comment> => {
  try {
    const response: AxiosResponse<Comment> = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
      text: commentText,
    });
    return response.data; // Return the parsed comment data
  } catch (error: any) {
    handleApiError(error, "Failed to add comment.");
    return Promise.reject(error); // Explicitly reject the Promise to maintain error flow
  }
};


// Fetch partner notifications
export const getPartnerNotifications = async (): Promise<Notification[]> => {
  try {
    const response: AxiosResponse<Notification[]> = await apiClient.get<Notification[]>("/partner-notifications");
    return response.data; // Return the parsed notifications
  } catch (error: any) {
    handleApiError(error, "Failed to fetch partner notifications.");
    return Promise.reject(error); // Explicitly reject the Promise to maintain error flow
  }
};


// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await apiClient.put(`/partner-notifications/${notificationId}/read`);
  } catch (error: any) {
    handleApiError(error, "Failed to mark notification as read.");
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await apiClient.delete(`/partner-notifications/${notificationId}`);
  } catch (error: any) {
    handleApiError(error, "Failed to delete notification.");
  }
};

export default {
  fetchDashboardData,
  fetchUserData,
  createTask,
  getFeed,
  createPost,
  likePost,
  unlikePost,
  addComment,
  getPartnerNotifications,
  markNotificationAsRead,
  deleteNotification,
};
