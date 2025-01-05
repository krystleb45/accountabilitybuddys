import { Response, NextFunction } from "express";
import Badge, { IBadge, BadgeLevel } from "../models/Badge";
import { awardPoints } from "../controllers/RewardController";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";
import sanitize from "mongo-sanitize";

// Badge levels configuration
const badgeLevels: BadgeLevel[] = ["Bronze", "Silver", "Gold"];

// Helper function to determine the next badge level
const getNextBadgeLevel = (currentLevel: BadgeLevel): BadgeLevel => {
  const currentIndex = badgeLevels.indexOf(currentLevel);
  return currentIndex < badgeLevels.length - 1
    ? badgeLevels[currentIndex + 1]
    : currentLevel;
};

/**
 * @desc    Award a badge to a user
 * @route   POST /api/badges/award
 * @access  Private
 */
export const awardBadge = catchAsync(
  async (
    req: CustomRequest<{}, any, { userId: string; badgeType: string; level?: BadgeLevel }>,
    res: Response,
    _next: NextFunction
  ) => {
    const { userId, badgeType, level = "Bronze" } = sanitize(req.body);

    if (!userId || !badgeType) {
      sendResponse(res, 400, false, "User ID and badge type are required");
      return;
    }

    // Check if the user already has the badge
    const existingBadge = await Badge.findOne({ user: userId, badgeType });

    if (existingBadge) {
      const currentLevel = existingBadge.level as BadgeLevel; // Explicitly cast to BadgeLevel
      const newLevel = getNextBadgeLevel(currentLevel);

      if (newLevel !== currentLevel) {
        existingBadge.level = newLevel;
        await existingBadge.save();
        logger.info(`Badge upgraded to ${newLevel} for user: ${userId}`);
        sendResponse(res, 200, true, "Badge upgraded successfully", {
          badge: existingBadge,
        });
        return;
      }

      logger.info(
        `User already has the highest badge level: ${existingBadge.level}`
      );
      sendResponse(
        res,
        200,
        true,
        "User already has the highest badge level",
        { badge: existingBadge }
      );
      return;
    }

    // Create a new badge for the user
    const newBadge = new Badge({ user: userId, badgeType, level });
    await newBadge.save();

    // Award points to the user for earning the badge
    const points = Badge.awardPointsForBadge(badgeType as IBadge["badgeType"]);
    await awardPoints(userId, points);


    logger.info(
      `New badge awarded to user: ${userId} with type: ${badgeType} at level: ${level}`
    );
    sendResponse(res, 201, true, "Badge awarded successfully", {
      badge: newBadge,
    });
  }
);

/**
 * @desc    Update badge progress for a user
 * @route   POST /api/badges/progress/update
 * @access  Private
 */
export const updateBadgeProgress = catchAsync(
  async (
    req: CustomRequest,
    res: Response,
    _next: NextFunction
  ) => {
    const { badgeType, increment }: { badgeType: string; increment: number } = sanitize(req.body);
    const userId = req.user?.id;

    if (!userId || !badgeType || !increment) {
      sendResponse(res, 400, false, "User ID, badge type, and increment are required.");
      return;
    }

    const badge = await Badge.findOne({ user: userId, badgeType });
    if (!badge) {
      sendResponse(res, 404, false, "Badge not found.");
      return;
    }

    badge.progress = (badge.progress || 0) + increment;
    await badge.save();

    sendResponse(res, 200, true, "Badge progress updated successfully.", { badge });
  }
);

/**
 * @desc    Remove expired badges
 * @route   DELETE /api/badges/expired/remove
 * @access  Private (Admin only)
 */
export const removeExpiredBadges = catchAsync(
  async (
    _req: CustomRequest,
    res: Response,
    _next: NextFunction
  ) => {
    const expiredBadges = await Badge.deleteMany({ expiresAt: { $lt: new Date() } });

    sendResponse(res, 200, true, "Expired badges removed successfully.", {
      count: expiredBadges.deletedCount,
    });
  }
);

/**
 * @desc    Fetch all badges for a user
 * @route   GET /api/badges
 * @access  Private
 */
export const getUserBadges = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    sendResponse(res, 400, false, "User ID is required");
    return;
  }

  const badges = await Badge.find({ user: userId });
  sendResponse(res, 200, true, "User badges fetched successfully", {
    badges,
  });
});
