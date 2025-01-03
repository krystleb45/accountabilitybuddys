import { Request, Response } from "express";
import mongoose from "mongoose";
import { GoalMessage } from "../models/GoalMessage";
import Goal from "../models/Goal";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

/**
 * @desc Create a new goal message
 * @route POST /api/goals/:goalId/messages
 * @access Private
 */
export const createGoalMessage = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { goalId } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (!goalId || !message || message.trim() === "") {
      sendResponse(res, 400, false, "Goal ID and message are required");
      return;
    }

    // Check if goal exists and belongs to the user
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    // Create a new goal message
    const newMessage = new GoalMessage({ goal: goalId, user: userId, message });
    await newMessage.save();

    sendResponse(res, 201, true, "Goal message created successfully", {
      message: newMessage,
    });
  },
);

/**
 * @desc Get messages for a goal
 * @route GET /api/goals/:goalId/messages
 * @access Private
 */
export const getGoalMessages = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user?.id;

    // Check if the user owns the goal
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    // Fetch messages for the specified goal
    const messages = await GoalMessage.find({ goal: goalId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, "Goal messages fetched successfully", {
      messages,
    });
  },
);

/**
 * @desc Delete a goal message
 * @route DELETE /api/goals/messages/:messageId
 * @access Private
 */
export const deleteGoalMessage = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
    const userId = req.user?.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      sendResponse(res, 400, false, "Invalid message ID format");
      return;
    }

    // Find the message and ensure it belongs to the user
    const message = await GoalMessage.findOne({ _id: messageId, user: userId });
    if (!message) {
      sendResponse(res, 404, false, "Message not found or access denied");
      return;
    }

    // Delete the message
    await message.deleteOne();

    sendResponse(res, 200, true, "Goal message deleted successfully");
  },
);

/**
 * @desc Edit a goal message
 * @route PATCH /api/goals/messages/:messageId
 * @access Private
 */
export const updateGoalMessage = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (!message || message.trim() === "") {
      sendResponse(res, 400, false, "Message content cannot be empty");
      return;
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      sendResponse(res, 400, false, "Invalid message ID format");
      return;
    }

    // Find the message and ensure it belongs to the user
    const existingMessage = await GoalMessage.findOne({
      _id: messageId,
      user: userId,
    });
    if (!existingMessage) {
      sendResponse(res, 404, false, "Message not found or access denied");
      return;
    }

    // Update the message content
    existingMessage.message = message;
    await existingMessage.save();

    sendResponse(res, 200, true, "Goal message updated successfully", {
      message: existingMessage,
    });
  },
);
