import { Response } from "express";
import GoalAnalytics from "../models/GoalAnalytics";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { createError } from "../middleware/errorHandler";

/**
 * @desc    Get user goal analytics
 * @route   GET /api/goal-analytics
 * @access  Private
 */
export const getUserGoalAnalytics = catchAsync(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      throw createError("User ID is required", 400);
    }

    const analytics = await GoalAnalytics.find({ user: userId });

    if (!analytics || analytics.length === 0) {
      sendResponse(res, 404, false, "No goal analytics found for the user");
      return;
    }

    sendResponse(res, 200, true, "User goal analytics fetched successfully", {
      analytics,
    });
  }
);

/**
 * @desc    Get global goal analytics
 * @route   GET /api/goal-analytics/global
 * @access  Private (Admin)
 */
export const getGlobalGoalAnalytics = catchAsync(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    if (!req.user?.isAdmin) {
      throw createError("Access denied", 403);
    }

    const analytics = await GoalAnalytics.find();

    if (!analytics || analytics.length === 0) {
      sendResponse(res, 404, false, "No global goal analytics found");
      return;
    }

    sendResponse(res, 200, true, "Global goal analytics fetched successfully", {
      analytics,
    });
  }
);

/**
 * @desc    Get goal analytics by ID
 * @route   GET /api/goal-analytics/:goalId
 * @access  Private
 */
export const getGoalAnalyticsById = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }> ,
    res: Response
  ): Promise<void> => {
    const { goalId } = req.params;

    if (!goalId) {
      throw createError("Goal ID is required", 400);
    }

    const analytics = await GoalAnalytics.findOne({ goal: goalId });

    if (!analytics) {
      sendResponse(res, 404, false, "Goal analytics not found");
      return;
    }

    sendResponse(res, 200, true, "Goal analytics fetched successfully", {
      analytics,
    });
  }
);

/**
 * @desc    Update goal analytics
 * @route   PUT /api/goal-analytics/:goalId
 * @access  Private
 */
export const updateGoalAnalytics = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }, any, any>,
    res: Response
  ): Promise<void> => {
    const { goalId } = req.params;
    const updates = req.body;

    if (!goalId) {
      throw createError("Goal ID is required", 400);
    }

    const updatedAnalytics = await GoalAnalytics.findOneAndUpdate(
      { goal: goalId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedAnalytics) {
      sendResponse(res, 404, false, "Goal analytics not found");
      return;
    }

    sendResponse(res, 200, true, "Goal analytics updated successfully", {
      analytics: updatedAnalytics,
    });
  }
);

/**
 * @desc    Delete goal analytics
 * @route   DELETE /api/goal-analytics/:goalId
 * @access  Private (Admin)
 */
export const deleteGoalAnalytics = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }>,
    res: Response
  ): Promise<void> => {
    if (!req.user?.isAdmin) {
      throw createError("Access denied", 403);
    }

    const { goalId } = req.params;

    if (!goalId) {
      throw createError("Goal ID is required", 400);
    }

    const deletedAnalytics = await GoalAnalytics.findOneAndDelete({ goal: goalId });

    if (!deletedAnalytics) {
      sendResponse(res, 404, false, "Goal analytics not found");
      return;
    }

    sendResponse(res, 200, true, "Goal analytics deleted successfully");
  }
);

export default {
  getUserGoalAnalytics,
  getGlobalGoalAnalytics,
  getGoalAnalyticsById,
  updateGoalAnalytics,
  deleteGoalAnalytics,
};
