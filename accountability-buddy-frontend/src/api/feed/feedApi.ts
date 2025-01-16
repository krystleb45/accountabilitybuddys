import axios from "axios";
import { getAuthHeader } from "../services/authService"; // Helper for getting the auth header with the token

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/users";

// Define the shape of a Feed Post
interface FeedPost {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: Comment[];
  // Add more fields as needed based on your API
}

// Define the shape of a Comment
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  // Add more fields as needed
}

// Helper function to handle API errors
const handleError = (error: any): never => {
  const message =
    error.response?.data?.message || "An error occurred. Please try again later.";
  throw new Error(message);
};

// Get all feed posts
export const getFeedPosts = async (): Promise<FeedPost[] | undefined> => {
  try {
    const response = await axios.get<FeedPost[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Create a new feed post
export const createFeedPost = async (
  postData: Partial<FeedPost>
): Promise<FeedPost | undefined> => {
  try {
    const response = await axios.post<FeedPost>(`${API_URL}/create`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Like a feed post
export const likeFeedPost = async (postId: string): Promise<FeedPost | undefined> => {
  try {
    const response = await axios.put<FeedPost>(
      `${API_URL}/${postId}/like`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Unlike a feed post
export const unlikeFeedPost = async (postId: string): Promise<FeedPost | undefined> => {
  try {
    const response = await axios.put<FeedPost>(
      `${API_URL}/${postId}/unlike`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Comment on a feed post
export const commentOnFeedPost = async (
  postId: string,
  commentData: { content: string }
): Promise<Comment | undefined> => {
  try {
    const response = await axios.post<Comment>(
      `${API_URL}/${postId}/comment`,
      commentData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
