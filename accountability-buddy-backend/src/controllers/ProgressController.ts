import { Response } from "express";
import Goal from "../models/Goal";
import AccountabilityPartnership from "../models/AccountabilityPartnership";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger"; // Centralized logger

/**
 * @desc Get Progress Dashboard
 * @route GET /api/progress/dashboard
 * @access Private
 */
export const getProgressDashboard = catchAsync(
  async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    try {
      // Fetch goals for the user with completion status and milestones
      const goals = await Goal.find({ user: userId })
        .select("title description dueDate status milestones")
        .sort({ createdAt: -1 }); // Sort by the most recent goals

      // Fetch accountability partnerships for the user
      const partnerships = await AccountabilityPartnership.find({
        $or: [{ user1: userId }, { user2: userId }],
      })
        .populate("user1 user2", "username profilePicture") // Populate user details
        .select("-__v") // Exclude version key for cleaner response
        .sort({ createdAt: -1 });

      // Prepare response data
      const progressData = {
        goals,
        partnerships,
      };

      // Send response
      sendResponse(
        res,
        200,
        true,
        "Progress dashboard fetched successfully",
        progressData,
      );
    } catch (error) {
      logger.error("Error fetching progress dashboard:", error);
      sendResponse(res, 500, false, "Failed to fetch progress dashboard");
    }
  },
);
