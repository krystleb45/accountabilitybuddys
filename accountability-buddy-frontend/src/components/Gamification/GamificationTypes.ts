/**
 * Type definitions for the Gamification feature
 */

// Type for individual badges
export interface Badge {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }
  
  // Type for user progress
  export interface UserProgress {
    id: string; // User ID
    name: string; // User name
    points: number; // Total points earned
    newBadge?: Badge; // Optional new badge earned
    badges: Badge[]; // List of all badges earned
  }
  
  // Type for leaderboard entry
  export interface LeaderboardEntry {
    userId: string; // ID of the user
    userName: string; // Display name of the user
    rank: number; // Rank of the user
    points: number; // Total points earned by the user
  }
  
  // Type for leaderboard data
  export interface LeaderboardData {
    entries: LeaderboardEntry[]; // Array of leaderboard entries
    userRank?: LeaderboardEntry; // Optional rank of the current user
  }
  
  // Type for notifications
  export interface Notification {
    id: string; // Unique ID for the notification
    message: string; // Notification message
    type: "success" | "info" | "warning" | "error"; // Type of notification
    timestamp: string; // Timestamp of the notification
  }
  