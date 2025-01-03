import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";

/**
 * @desc Award points to a user
 * @param userId - ID of the user
 * @param points - Points to award
 */
export const awardPoints = async (
  userId: string,
  points: number,
): Promise<string> => {
  if (!userId || points <= 0) {
    throw new Error("Invalid user ID or points");
  }

  const user = await User.findById(userId);
  if (!user) {
    logger.warn(`User not found for awarding points. UserID: ${userId}`);
    throw new Error(`User with ID ${userId} not found`);
  }

  user.points = (user.points || 0) + points;
  await user.save();

  logger.info(`Awarded ${points} points to user: ${userId}`);
  return `Awarded ${points} points to user: ${userId}`;
};

/**
 * @desc Deduct points from a user
 * @param userId - ID of the user
 * @param points - Points to deduct
 */
export const deductPoints = async (
  userId: string,
  points: number,
): Promise<string> => {
  if (!userId || points <= 0) {
    throw new Error("Invalid user ID or points");
  }

  const user = await User.findById(userId);
  if (!user) {
    logger.warn(`User not found for deducting points. UserID: ${userId}`);
    throw new Error(`User with ID ${userId} not found`);
  }

  if ((user.points || 0) < points) {
    throw new Error(`User with ID ${userId} does not have enough points`);
  }

  user.points = (user.points || 0) - points;
  await user.save();

  logger.info(`Deducted ${points} points from user: ${userId}`);
  return `Deducted ${points} points from user: ${userId}`;
};

/**
 * @desc Get user's current reward points
 * @route GET /api/rewards/:userId
 * @access Private
 */
export const getUserPoints = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`User not found while fetching points. UserID: ${userId}`);
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "User points fetched successfully", {
      points: user.points || 0,
    });
  }
);

/**
 * @desc Transfer points between users
 * @param senderId - Sender's ID
 * @param receiverId - Receiver's ID
 * @param points - Points to transfer
 */
export const transferPoints = async (
  senderId: string,
  receiverId: string,
  points: number,
): Promise<string> => {
  if (!senderId || !receiverId || points <= 0) {
    throw new Error("Invalid sender, receiver, or points");
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender) {
    logger.warn(`Sender not found for point transfer. SenderID: ${senderId}`);
    throw new Error(`Sender with ID ${senderId} not found`);
  }

  if (!receiver) {
    logger.warn(
      `Receiver not found for point transfer. ReceiverID: ${receiverId}`,
    );
    throw new Error(`Receiver with ID ${receiverId} not found`);
  }

  if ((sender.points || 0) < points) {
    throw new Error(`Sender with ID ${senderId} does not have enough points`);
  }

  sender.points = (sender.points || 0) - points;
  receiver.points = (receiver.points || 0) + points;

  await sender.save();
  await receiver.save();

  logger.info(
    `Transferred ${points} points from user: ${senderId} to user: ${receiverId}`
  );
  return `Transferred ${points} points from user: ${senderId} to user: ${receiverId}`;
};

export default {
  awardPoints,
  deductPoints,
  getUserPoints,
  transferPoints,
};
