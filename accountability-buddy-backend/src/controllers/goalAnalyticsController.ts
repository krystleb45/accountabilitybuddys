import { Request, Response } from "express";
import GoalAnalytics from "../models/GoalAnalytics";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const goalAnalyticsController = {
  getUserGoalAnalytics: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;

      if (!userId) {
        sendResponse(res, 401, false, "Unauthorized access");
        return;
      }

      const analytics = await GoalAnalytics.find({ user: userId });

      if (!analytics || analytics.length === 0) {
        sendResponse(res, 404, false, "No goal analytics found for the user");
        return;
      }

      sendResponse(res, 200, true, "User goal analytics fetched successfully", {
        analytics,
      });
    },
  ),

  getGlobalGoalAnalytics: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      if (!req.user?.isAdmin) {
        sendResponse(res, 403, false, "Access denied");
        return;
      }

      const analytics = await GoalAnalytics.find();

      if (!analytics || analytics.length === 0) {
        sendResponse(res, 404, false, "No global goal analytics found");
        return;
      }

      sendResponse(
        res,
        200,
        true,
        "Global goal analytics fetched successfully",
        { analytics },
      );
    },
  ),

  getGoalAnalyticsById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { goalId } = req.params;

      if (!goalId) {
        sendResponse(res, 400, false, "Goal ID is required");
        return;
      }

      const analytics = await GoalAnalytics.findOne({ goal: goalId });

      if (!analytics) {
        sendResponse(res, 404, false, "Goal analytics not found");
        return;
      }

      sendResponse(res, 200, true, "Goal analytics fetched successfully", {
        analytics,
      });
    },
  ),

  updateGoalAnalytics: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { goalId } = req.params;
      const updates = req.body;

      if (!goalId) {
        sendResponse(res, 400, false, "Goal ID is required");
        return;
      }

      const updatedAnalytics = await GoalAnalytics.findOneAndUpdate(
        { goal: goalId },
        updates,
        { new: true, runValidators: true },
      );

      if (!updatedAnalytics) {
        sendResponse(res, 404, false, "Goal analytics not found");
        return;
      }

      sendResponse(res, 200, true, "Goal analytics updated successfully", {
        analytics: updatedAnalytics,
      });
    },
  ),

  deleteGoalAnalytics: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      if (!req.user?.isAdmin) {
        sendResponse(res, 403, false, "Access denied");
        return;
      }

      const { goalId } = req.params;

      if (!goalId) {
        sendResponse(res, 400, false, "Goal ID is required");
        return;
      }

      const deletedAnalytics = await GoalAnalytics.findOneAndDelete({
        goal: goalId,
      });

      if (!deletedAnalytics) {
        sendResponse(res, 404, false, "Goal analytics not found");
        return;
      }

      sendResponse(res, 200, true, "Goal analytics deleted successfully");
    },
  ),
};

export default goalAnalyticsController;
