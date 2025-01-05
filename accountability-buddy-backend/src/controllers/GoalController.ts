import { Response } from "express";
import Goal from "../models/Goal";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { createError } from "../middleware/errorHandler";

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
export const createGoal = catchAsync(
  async (
    req: CustomRequest<{}, any, { title: string; description?: string; dueDate: string }>,
    res: Response
  ): Promise<void> => {
    const { title, description, dueDate } = req.body;
    const userId = req.user?.id;

    if (!title || !dueDate) {
      throw createError("Title and due date are required", 400);
    }

    if (new Date(dueDate) <= new Date()) {
      throw createError("Due date must be in the future", 400);
    }

    const newGoal = await Goal.create({
      title,
      description,
      dueDate,
      user: userId,
    });

    sendResponse(res, 201, true, "Goal created successfully", { goal: newGoal });
  }
);

/**
 * @desc    Get user goals
 * @route   GET /api/goals
 * @access  Private
 */
export const getUserGoals = catchAsync(
  async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

    if (!goals || goals.length === 0) {
      sendResponse(res, 404, false, "No goals found for this user");
      return;
    }

    sendResponse(res, 200, true, "User goals fetched successfully", { goals });
  }
);

/**
 * @desc    Update a goal
 * @route   PUT /api/goals/:goalId
 * @access  Private
 */
export const updateGoal = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }>,
    res: Response
  ): Promise<void> => {
    const { goalId } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    Object.assign(goal, updates);
    await goal.save();

    sendResponse(res, 200, true, "Goal updated successfully", { goal });
  }
);

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:goalId
 * @access  Private
 */
export const deleteGoal = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }>,
    res: Response
  ): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user?.id;

    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    sendResponse(res, 200, true, "Goal deleted successfully");
  }
);

/**
 * @desc    Mark a goal as completed
 * @route   PATCH /api/goals/:goalId/complete
 * @access  Private
 */
export const markGoalAsCompleted = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }>,
    res: Response
  ): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user?.id;

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    goal.status = "completed";
    goal.completedAt = new Date();
    await goal.save();

    sendResponse(res, 200, true, "Goal marked as completed successfully", { goal });
  }
);

/**
 * @desc    Set goal priority
 * @route   PATCH /api/goals/:goalId/priority
 * @access  Private
 */
export const setGoalPriority = catchAsync(
  async (
    req: CustomRequest<{ goalId: string }, any, { priority: string }>,
    res: Response
  ): Promise<void> => {
    const { goalId } = req.params;
    const { priority } = req.body;
    const userId = req.user?.id;

    const validPriorities = ["high", "medium", "low"];
    if (!validPriorities.includes(priority)) {
      sendResponse(res, 400, false, "Invalid priority value");
      return;
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    goal.priority = priority;
    await goal.save();

    sendResponse(res, 200, true, "Goal priority updated successfully", { goal });
  }
);
