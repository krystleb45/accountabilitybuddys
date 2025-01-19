import axios from "axios";
import { getAuthHeader } from "src/services/authService"; // Helper to get the Authorization header

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/users";

// Define the structure of a Post
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
  // Add more fields as needed based on your API
}

// Define the structure of a Comment
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  // Add more fields as needed
}

// Helper function to handle API errors
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error("Invalid credentials. Please try again.");
  }
  throw new Error(
    error.response?.data?.message || "An error occurred. Please try again later."
  );
};

// Fetch all posts (e.g., for the user’s feed)
export const fetchPosts = async (): Promise<Post[] | undefined> => {
  try {
    const response = await axios.get<Post[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Fetch a specific post by ID
export const fetchPostById = async (postId: string): Promise<Post | undefined> => {
  try {
    const response = await axios.get<Post>(`${API_URL}/${postId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Create a new post
export const createPost = async (postData: Partial<Post>): Promise<Post | undefined> => {
  try {
    const response = await axios.post<Post>(`${API_URL}`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Update an existing post
export const updatePost = async (postId: string, postData: Partial<Post>): Promise<Post | undefined> => {
  try {
    const response = await axios.put<Post>(`${API_URL}/${postId}`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Delete a post
export const deletePost = async (postId: string): Promise<{ message: string } | undefined> => {
  try {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${postId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined;
  }
};

// Like a post
export const likePost = async (postId: string): Promise<Post | undefined> => {
  try {
    const response = await axios.post<Post>(
      `${API_URL}/${postId}/like`,
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

// Comment on a post
export const commentOnPost = async (
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
    return undefined;
  }
};
