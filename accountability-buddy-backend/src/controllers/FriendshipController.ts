import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

/**
 * @desc    Send a friend request
 * @route   POST /api/friends/request
 * @access  Private
 */
export const sendFriendRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { friendId }: { friendId: string } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      sendResponse(res, 400, false, "Invalid user ID format");
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    const friend = await User.findById(friendObjectId);

    if (!friend) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    if (friend.friendRequests.includes(userObjectId)) {
      sendResponse(res, 400, false, "Friend request already sent");
      return;
    }

    if (friend.friends.includes(userObjectId)) {
      sendResponse(res, 400, false, "User is already a friend");
      return;
    }

    friend.friendRequests.push(userObjectId);
    await friend.save();

    sendResponse(res, 200, true, "Friend request sent successfully");
  },
);

/**
 * @desc    Accept a friend request
 * @route   POST /api/friends/accept
 * @access  Private
 */
export const acceptFriendRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { friendId }: { friendId: string } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      sendResponse(res, 400, false, "Invalid user ID format");
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    const user = await User.findById(userObjectId);
    const friend = await User.findById(friendObjectId);

    if (!user?.friendRequests.includes(friendObjectId)) {
      sendResponse(res, 400, false, "No friend request found from this user");
      return;
    }

    user.friends.push(friendObjectId);
    friend?.friends.push(userObjectId);

    user.friendRequests = user.friendRequests.filter(
      (id) => !id.equals(friendObjectId),
    );

    await user.save();
    await friend?.save();

    sendResponse(res, 200, true, "Friend request accepted");
  },
);

/**
 * @desc    Decline a friend request
 * @route   POST /api/friends/decline
 * @access  Private
 */
export const declineFriendRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { friendId }: { friendId: string } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized access");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      sendResponse(res, 400, false, "Invalid user ID format");
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const friendObjectId = new Types.ObjectId(friendId);

    const user = await User.findById(userObjectId);

    if (!user?.friendRequests.includes(friendObjectId)) {
      sendResponse(res, 400, false, "No friend request found from this user");
      return;
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => !id.equals(friendObjectId),
    );

    await user.save();

    sendResponse(res, 200, true, "Friend request declined");
  },
);

/**
 * @desc    Get all friends of the user
 * @route   GET /api/friends
 * @access  Private
 */
export const getFriends = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized access");
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const user = await User.findById(userObjectId).populate(
      "friends",
      "username profilePicture",
    );

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Friends fetched successfully", {
      friends: user.friends,
    });
  },
);

/**
 * @desc    Get all friend requests of the user
 * @route   GET /api/friends/requests
 * @access  Private
 */
export const getFriendRequests = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized access");
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    const user = await User.findById(userObjectId).populate(
      "friendRequests",
      "username profilePicture",
    );

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Friend requests fetched successfully", {
      friendRequests: user.friendRequests,
    });
  },
);
