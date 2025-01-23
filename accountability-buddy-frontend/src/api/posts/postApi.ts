import axios from 'axios';
import { getAuthHeader } from 'src/services/authService'; // Helper to get the Authorization header

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

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
}

// Define the structure of a Comment
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
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

// Fetch all posts (e.g., for the user’s feed)
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<Post[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Fetch a specific post by ID
export const fetchPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await axios.get<Post>(`${API_URL}/${postId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Create a new post
export const createPost = async (postData: Partial<Post>): Promise<Post> => {
  try {
    const response = await axios.post<Post>(`${API_URL}`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Update an existing post
export const updatePost = async (
  postId: string,
  postData: Partial<Post>
): Promise<Post> => {
  try {
    const response = await axios.put<Post>(`${API_URL}/${postId}`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};

// Delete a post
export const deletePost = async (
  postId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/${postId}`,
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

// Like a post
export const likePost = async (postId: string): Promise<Post> => {
  try {
    const response = await axios.post<Post>(
      `${API_URL}/${postId}/like`,
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

// Comment on a post
export const commentOnPost = async (
  postId: string,
  commentData: { content: string }
): Promise<Comment> => {
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
    throw new Error('Unreachable: This line ensures TypeScript compliance');
  }
};
