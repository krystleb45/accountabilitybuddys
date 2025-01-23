import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Helper for getting the auth header with the token

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

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
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred. Please try again later.');
  }
};

// Get all feed posts
export const getFeedPosts = async (): Promise<FeedPost[] | undefined> => {
  try {
    const response = await axios.get<FeedPost[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    return undefined; // Ensures TypeScript sees this function always has a return
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
  } catch (error: unknown) {
    handleError(error);
    return undefined;
  }
};

// Like a feed post
export const likeFeedPost = async (
  postId: string
): Promise<FeedPost | undefined> => {
  try {
    const response = await axios.put<FeedPost>(
      `${API_URL}/${postId}/like`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    return undefined;
  }
};

// Unlike a feed post
export const unlikeFeedPost = async (
  postId: string
): Promise<FeedPost | undefined> => {
  try {
    const response = await axios.put<FeedPost>(
      `${API_URL}/${postId}/unlike`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    return undefined;
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
  } catch (error: unknown) {
    handleError(error);
    return undefined;
  }
};
