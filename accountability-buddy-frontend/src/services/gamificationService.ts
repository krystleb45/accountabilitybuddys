import axios, { AxiosResponse } from "axios";
import { Badge, UserProgress } from "../types/Gamification"; // Import centralized types

// Base API URL (use environment variables for flexibility)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com";

// Define type for leaderboard entry
export interface LeaderboardEntry {
  userId: string; // Unique identifier for leaderboard entry
  displayName: string; // User's display name
  score: number; // User's score
}

// Helper function to get authentication headers (if needed)
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Centralized error handling
const handleError = (functionName: string, error: unknown): void => {
  console.error(`Error in ${functionName}:`, error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(
        `Server responded with status: ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error("Request made, but no response received.");
    }
  } else {
    console.error("Unexpected error:", error);
  }
};

// Fetch badges for a specific user from the backend
export const fetchBadges = async (userId: string): Promise<Badge[]> => {
  try {
    const response: AxiosResponse<
      { id: string; name: string; description: string; iconUrl: string }[]
    > = await axios.get(`${API_BASE_URL}/users/${userId}/badges`, {
      headers: getAuthHeader(),
    });

    // Transform API response to match the centralized Badge type
    return response.data.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      imageUrl: badge.iconUrl, // Map `iconUrl` from API to `imageUrl` in Badge type
    }));
  } catch (error) {
    handleError("fetchBadges", error);
    return []; // Return empty array in case of error
  }
};

// Fetch user progress from the backend
export const fetchUserProgress = async (userId: string): Promise<UserProgress> => {
  try {
    const response: AxiosResponse<UserProgress & { newBadge?: { name: string } }> = await axios.get(
      `${API_BASE_URL}/users/${userId}/progress`,
      {
        headers: getAuthHeader(),
      }
    );

    // Return response data as is, as it already conforms to the UserProgress type
    return {
      ...response.data,
      newBadge: response.data.newBadge || undefined, // Ensure newBadge is properly typed
    };
  } catch (error) {
    handleError("fetchUserProgress", error);
    return { points: 0, level: 1, badges: [], newBadge: undefined }; // Default values
  }
};

// Fetch leaderboard data from backend
export const fetchLeaderboard = async (
  userId: string
): Promise<LeaderboardEntry[]> => {
  try {
    const response: AxiosResponse<LeaderboardEntry[]> = await axios.get(
      `${API_BASE_URL}/leaderboard?userId=${userId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.map((entry) => ({
      userId: entry.userId,
      displayName: entry.displayName || "Anonymous", // Fallback for missing displayName
      score: entry.score,
    }));
  } catch (error) {
    handleError("fetchLeaderboard", error);
    return []; // Return empty array in case of error
  }
};

// Explicitly re-export the `UserProgress` type
export type { UserProgress };

export default {
  fetchBadges,
  fetchUserProgress,
  fetchLeaderboard,
};
