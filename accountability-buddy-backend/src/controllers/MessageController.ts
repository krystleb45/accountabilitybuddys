import { Response } from "express";
import { PrivateMessage } from "../models/PrivateMessage";
import User from "../models/User"; // Ensure User is properly exported
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";

// Sanitize input utility
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, ""); // Example: Simple sanitization
};

/**
 * @desc Send a message to a user
 * @route POST /api/messages
 * @access Private
 */
export const sendMessage = catchAsync(async (req: CustomRequest, res: Response) => {
  const { receiverId, message }: { receiverId: string; message: string } = req.body;
  const senderId = req.user?.id;

  if (!receiverId) {
    sendResponse(res, 400, false, "Receiver ID is required");
    return;
  }

  if (!message || message.trim() === "") {
    sendResponse(res, 400, false, "Message content cannot be empty");
    return;
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    sendResponse(res, 404, false, "Receiver not found");
    return;
  }

  const sanitizedMessage = sanitizeInput(message);

  const newMessage = await PrivateMessage.create({
    sender: senderId,
    receiver: receiverId,
    content: sanitizedMessage,
  });

  logger.info(`Message sent from user ${senderId} to user ${receiverId}`);
  sendResponse(res, 201, true, "Message sent successfully", {
    message: newMessage,
  });
});

/**
 * @desc Get messages with a specific user (with pagination)
 * @route GET /api/messages/:userId
 * @access Private
 */
export const getMessagesWithUser = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    const messages = await PrivateMessage.find({
      $or: [
        { sender: req.user?.id, receiver: userId },
        { sender: userId, receiver: req.user?.id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalMessages = await PrivateMessage.countDocuments({
      $or: [
        { sender: req.user?.id, receiver: userId },
        { sender: userId, receiver: req.user?.id },
      ],
    });

    sendResponse(res, 200, true, "Messages fetched successfully", {
      messages,
      pagination: {
        totalMessages,
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
      },
    });
  },
);

/**
 * @desc Delete a message
 * @route DELETE /api/messages/:messageId
 * @access Private
 */
export const deleteMessage = catchAsync(async (req: CustomRequest, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user?.id;

  const message = await PrivateMessage.findById(messageId);
  if (!message) {
    sendResponse(res, 404, false, "Message not found");
    return;
  }

  if (message.sender.toString() !== userId) {
    sendResponse(res, 403, false, "You are not authorized to delete this message");
    return;
  }

  await PrivateMessage.deleteOne({ _id: messageId });

  logger.info(`Message with ID ${messageId} deleted by user ${userId}`);
  sendResponse(res, 200, true, "Message deleted successfully");
});

/**
 * @desc Mark messages as read
 * @route PATCH /api/messages/:userId/read
 * @access Private
 */
export const markMessagesAsRead = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    const updatedMessages = await PrivateMessage.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { isRead: true },
    );

    sendResponse(res, 200, true, "Messages marked as read", {
      updatedMessages: updatedMessages.modifiedCount,
    });
  },
);
