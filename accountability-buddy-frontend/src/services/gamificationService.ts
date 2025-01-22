import axios, { AxiosResponse } from 'axios';
import { Badge, UserProgress } from '../types/Gamification.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
}

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleError = (functionName: string, error: unknown): never => {
  console.error(`Error in ${functionName}:`, error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`Server responded with status: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('Request made, but no response received.');
    }
  } else {
    console.error('Unexpected error:', error);
  }

  throw new Error(`An error occurred in ${functionName}. Please try again later.`);
};

const GamificationService = {
  /**
   * Fetch badges for a specific user from the backend.
   */
  fetchBadges: async (userId: string): Promise<Badge[] | undefined> => {
    try {
      const response: AxiosResponse<
        { id: string; name: string; description: string; iconUrl: string }[]
      > = await axios.get(`${API_BASE_URL}/users/${userId}/badges`, {
        headers: getAuthHeader(),
      });

      return response.data.map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        imageUrl: badge.iconUrl,
      }));
    } catch (error) {
      handleError('fetchBadges', error);
      return undefined; // Explicit return of `undefined` in case of an error
    }
  },

  /**
   * Fetch user progress from the backend.
   */
  fetchUserProgress: async (userId: string): Promise<UserProgress | undefined> => {
    try {
      const response: AxiosResponse<UserProgress & { newBadge?: { name: string } }> = await axios.get(
        `${API_BASE_URL}/users/${userId}/progress`,
        {
          headers: getAuthHeader(),
        }
      );

      return {
        ...response.data,
        newBadge: response.data.newBadge || undefined,
      };
    } catch (error) {
      handleError('fetchUserProgress', error);
      return undefined; // Explicit return of `undefined` in case of an error
    }
  },

  /**
   * Fetch leaderboard data from the backend.
   */
  fetchLeaderboard: async (
    userId: string
  ): Promise<LeaderboardEntry[] | undefined> => {
    try {
      const response: AxiosResponse<LeaderboardEntry[]> = await axios.get(
        `${API_BASE_URL}/leaderboard`,
        {
          params: { userId },
          headers: getAuthHeader(),
        }
      );

      return response.data.map((entry) => ({
        userId: entry.userId,
        displayName: entry.displayName || 'Anonymous',
        score: entry.score,
      }));
    } catch (error) {
      handleError('fetchLeaderboard', error);
      return undefined; // Explicit return of `undefined` in case of an error
    }
  },
};

export type { UserProgress };
export default GamificationService;
