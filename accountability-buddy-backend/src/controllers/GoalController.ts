import { Request, Response, NextFunction } from "express";
import Goal from "../models/Goal";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { createError } from "../middleware/errorHandler";
import { Reminder } from "../models/Reminder";

// Extended Request type for user property
interface RequestWithUser extends Request {
  user?: {
    id: string;
    email?: string;
    role: "user" | "admin" | "moderator";
    isAdmin?: boolean;
  };
}

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
export const createGoal = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { title, description, dueDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    if (!title || !dueDate) {
      return next(createError("Title and due date are required", 400));
    }

    if (new Date(dueDate) <= new Date()) {
      return next(createError("Due date must be in the future", 400));
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
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

    if (!goals || goals.length === 0) {
      return next(createError("No goals found for this user", 404));
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
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
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
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
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
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
    }

    goal.status = "completed";
    goal.completedAt = new Date();
    await goal.save();

    sendResponse(res, 200, true, "Goal marked as completed successfully", { goal });
  }
);
/**
 * @desc    Update goal progress
 * @route   PUT /goal/:goalId/progress
 * @access  Private
 */
export const updateGoalProgress = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId } = req.params;
    const { progress } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
    }

    if (progress < 0 || progress > 100) {
      return next(createError("Progress must be between 0 and 100", 400));
    }

    goal.progress = progress;
    await goal.save();

    sendResponse(res, 200, true, "Goal progress updated successfully", { goal });
  }
);

/**
 * @desc    Complete a goal
 * @route   PUT /goal/:goalId/complete
 * @access  Private
 */
export const completeGoal = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
    }

    goal.status = "completed";
    goal.completedAt = new Date();
    await goal.save();

    sendResponse(res, 200, true, "Goal marked as completed successfully", { goal });
  }
);

/**
 * @desc    Get goal analytics
 * @route   GET /goal/analytics
 * @access  Private
 */
export const getAnalytics = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const totalGoals = await Goal.countDocuments({ user: userId });
    const completedGoals = await Goal.countDocuments({
      user: userId,
      status: "completed",
    });
    const inProgressGoals = totalGoals - completedGoals;

    const analytics = {
      totalGoals,
      completedGoals,
      inProgressGoals,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
    };

    sendResponse(res, 200, true, "Goal analytics retrieved successfully", { analytics });
  }
);

/**
 * @desc    Set reminders for goals
 * @route   POST /goal/reminders
 * @access  Private
 */
export const setReminder = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId, message, remindAt } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
    }

    if (new Date(remindAt) <= new Date()) {
      return next(createError("Reminder date must be in the future", 400));
    }

    const newReminder = await Reminder.create({
      user: userId,
      goal: goalId,
      message,
      remindAt,
    });

    sendResponse(res, 201, true, "Reminder set successfully", { reminder: newReminder });
  }
);

/**
 * @desc    Get public goals
 * @route   GET /goal/public
 * @access  Public
 */
export const getPublicGoals = catchAsync(
  async (
    req: Request<{}, {}, {}, { page?: string; limit?: string }>, // Explicitly define query parameters
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const page = parseInt(req.query.page || "1", 10); // Default to page 1
    const limit = parseInt(req.query.limit || "10", 10); // Default to 10 items per page

    const publicGoals = await Goal.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalGoals = await Goal.countDocuments({ isPublic: true });

    sendResponse(res, 200, true, "Public goals fetched successfully", {
      publicGoals,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalGoals / limit),
        totalGoals,
      },
    });
  }
);

/**
 * @desc    Set goal priority
 * @route   PATCH /api/goals/:goalId/priority
 * @access  Private
 */
export const setGoalPriority = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { goalId } = req.params;
    const { priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("Unauthorized access", 401));
    }

    const validPriorities = ["high", "medium", "low"];
    if (!validPriorities.includes(priority)) {
      return next(createError("Invalid priority value", 400));
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return next(createError("Goal not found or access denied", 404));
    }

    goal.priority = priority as "high" | "medium" | "low"; // Cast the priority value to the correct type
    await goal.save();

    sendResponse(res, 200, true, "Goal priority updated successfully", { goal });
  }
);


