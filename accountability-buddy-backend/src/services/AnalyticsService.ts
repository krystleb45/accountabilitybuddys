import Goal from "../models/Goal";
import Challenge from "../models/Challenge";
import ActivityLog from "../models/ActivityLog";
import logger from "../utils/winstonLogger";

/**
 * @desc    Calculates the goal completion rate for a user.
 * @param   userId - The ID of the user.
 * @returns The completion rate (0 to 100).
 */
const calculateGoalCompletionRate = async (userId: string): Promise<number> => {
  try {
    const goals = await Goal.find({ userId });
    if (!goals.length) return 0;

    const completedGoals = goals.filter((goal) => goal.status === "completed").length;
    const completionRate = (completedGoals / goals.length) * 100;

    return completionRate;
  } catch (error) {
    logger.error(`Error calculating goal completion rate for user ${userId}: ${error.message}`);
    return 0;
  }
};

/**
 * @desc    Calculates the challenge participation rate for a user.
 * @param   userId - The ID of the user.
 * @returns The participation rate (0 to 100).
 */
const calculateChallengeParticipationRate = async (userId: string): Promise<number> => {
  try {
    const challenges = await Challenge.find({ "participants.userId": userId });
    if (!challenges.length) return 0;

    const completedChallenges = challenges.filter((challenge) =>
      challenge.participants.some(
        (participant) => participant.userId.toString() === userId && participant.progress >= 100
      )
    ).length;

    const participationRate = (completedChallenges / challenges.length) * 100;
    return participationRate;
  } catch (error) {
    logger.error(`Error calculating challenge participation rate for user ${userId}: ${error.message}`);
    return 0;
  }
};

/**
 * @desc    Calculates the average goal progress for a user.
 * @param   userId - The ID of the user.
 * @returns The average progress (0 to 100).
 */
const calculateAverageGoalProgress = async (userId: string): Promise<number> => {
  try {
    const goals = await Goal.find({ userId });
    if (!goals.length) return 0;

    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    const averageProgress = totalProgress / goals.length;

    return averageProgress;
  } catch (error) {
    logger.error(`Error calculating average goal progress for user ${userId}: ${error.message}`);
    return 0;
  }
};

/**
 * @desc    Calculates user engagement level based on login frequency and actions taken.
 * @param   userId - The ID of the user.
 * @returns User activity level ("low", "medium", "high").
 */
const calculateUserActivityLevel = async (userId: string): Promise<string> => {
  try {
    const activityLogs = await ActivityLog.find({ userId });
    const totalActions = activityLogs.length;

    if (totalActions >= 50) return "high";
    if (totalActions >= 20) return "medium";
    return "low";
  } catch (error) {
    logger.error(`Error calculating user activity level for user ${userId}: ${error.message}`);
    return "low";
  }
};

/**
 * @desc    Calculates the milestone completion rate for all goals of a user.
 * @param   userId - The ID of the user.
 * @returns The milestone completion rate (0 to 100).
 */
const calculateMilestoneCompletionRate = async (userId: string): Promise<number> => {
  try {
    const goals = await Goal.find({ userId });
    if (!goals.length) return 0;

    let totalMilestones = 0;
    let completedMilestones = 0;

    goals.forEach((goal) => {
      totalMilestones += goal.milestones.length;
      completedMilestones += goal.milestones.filter((milestone) => milestone.completed).length;
    });

    const completionRate = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
    return completionRate;
  } catch (error) {
    logger.error(`Error calculating milestone completion rate for user ${userId}: ${error.message}`);
    return 0;
  }
};

/**
 * @desc    Fetches comprehensive user analytics including various metrics.
 * @param   userId - The ID of the user.
 * @returns An object containing all analytics metrics.
 */
const getUserAnalytics = async (userId: string): Promise<Record<string, any> | null> => {
  try {
    const goalCompletionRate = await calculateGoalCompletionRate(userId);
    const challengeParticipationRate = await calculateChallengeParticipationRate(userId);
    const averageGoalProgress = await calculateAverageGoalProgress(userId);
    const userActivityLevel = await calculateUserActivityLevel(userId);
    const milestoneCompletionRate = await calculateMilestoneCompletionRate(userId);

    return {
      goalCompletionRate,
      challengeParticipationRate,
      averageGoalProgress,
      userActivityLevel,
      milestoneCompletionRate,
    };
  } catch (error) {
    logger.error(`Error fetching analytics for user ${userId}: ${error.message}`);
    return null;
  }
};

/**
 * @desc    Fetches global analytics metrics for all users.
 * @returns An object containing aggregated global analytics metrics.
 */
const getGlobalAnalytics = async (): Promise<Record<string, any> | null> => {
  try {
    const totalUsers = await Goal.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const totalChallenges = await Challenge.countDocuments();

    return {
      totalUsers,
      totalGoals,
      totalChallenges,
    };
  } catch (error) {
    logger.error(`Error fetching global analytics: ${error.message}`);
    return null;
  }
};

export default {
  calculateGoalCompletionRate,
  calculateChallengeParticipationRate,
  calculateAverageGoalProgress,
  calculateUserActivityLevel,
  calculateMilestoneCompletionRate,
  getUserAnalytics,
  getGlobalAnalytics,
};
