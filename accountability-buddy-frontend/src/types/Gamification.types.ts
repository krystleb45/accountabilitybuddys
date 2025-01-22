/**
 * Represents a badge awarded to a user.
 */
export interface Badge {
  /** Unique identifier for the badge. */
  id: string;

  /** Name of the badge. */
  name: string;

  /** Description of the badge, explaining its significance or how it was earned. */
  description: string;

  /** URL of the badge's image or icon. */
  imageUrl: string;

  /** Category of the badge (optional, e.g., "Achievement", "Milestone"). */
  category?: string;

  /** Date when the badge was awarded (ISO format, optional). */
  awardedAt?: string;
}

/**
 * Represents the progress of a user in the gamification system.
 */
export interface UserProgress {
  /** Total points accumulated by the user. */
  points: number;

  /** Current level of the user. */
  level: number;

  /** Array of badges earned by the user. */
  badges: Badge[];

  /** Details of the most recently earned badge (optional). */
  newBadge?: {
    /** Name of the new badge. */
    name: string;

    /** ID of the new badge (optional). */
    id?: string;

    /** Date when the new badge was awarded (ISO format, optional). */
    awardedAt?: string;
  };

  /** Progress percentage towards the next level (optional). */
  progressToNextLevel?: number;

  /** Estimated points required to reach the next level (optional). */
  pointsToNextLevel?: number;
}

/**
 * Represents a leaderboard entry.
 */
export interface LeaderboardEntry {
  /** Unique identifier for the user in the leaderboard. */
  userId: string;

  /** Display name of the user. */
  displayName: string;

  /** Total points accumulated by the user. */
  score: number;

  /** Rank of the user in the leaderboard. */
  rank: number;

  /** URL to the user's profile picture (optional). */
  avatarUrl?: string;

  /** Additional metadata about the user (optional). */
  metadata?: Record<string, any>;
}

/**
 * Represents gamification configuration for a system or application.
 */
export interface GamificationConfig {
  /** Point thresholds for leveling up (e.g., level 1 requires 100 points). */
  levelThresholds: number[];

  /** Criteria for awarding badges (optional). */
  badgeCriteria?: {
    [badgeId: string]: {
      /** Required points to earn the badge. */
      points?: number;

      /** Specific achievements or milestones required for the badge. */
      achievements?: string[];
    };
  };

  /** Maximum level a user can achieve (optional). */
  maxLevel?: number;
}
