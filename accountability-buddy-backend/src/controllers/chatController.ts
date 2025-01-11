import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Chat from "../models/Chat";
import Group from "../models/Group";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import sanitize from "mongo-sanitize";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

/**
 * @desc    Add a user to a chat group
 * @route   PUT /chat/group/:groupId/add
 * @access  Private
 */
export const addUserToGroup = catchAsync(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { groupId } = req.params;
    const { userId } = sanitize(req.body);

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    const group = await Group.findById(groupId);
    if (!group) {
      sendResponse(res, 404, false, "Group not found");
      return;
    }

    const newMember = new mongoose.Types.ObjectId(userId);
    if (group.members.some((member) => member.equals(newMember))) {
      sendResponse(res, 400, false, "User is already a member of this group");
      return;
    }

    group.members.push(newMember);
    await group.save();

    sendResponse(res, 200, true, "User added to the group successfully", { group });
  }
);

/**
 * @desc    Delete a chat group
 * @route   DELETE /chat/group/:groupId/delete
 * @access  Private
 */
export const deleteGroup = catchAsync(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { groupId } = req.params;

    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      sendResponse(res, 404, false, "Group not found");
      return;
    }

    sendResponse(res, 200, true, "Group deleted successfully");
  }
);

/**
 * @desc    Get private chats for the logged-in user
 * @route   GET /chat/private
 * @access  Private (Standard and above subscriptions)
 */
export const getPrivateChats = catchAsync(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "username")
      .populate("receiver", "username")
      .sort({ createdAt: -1 });

    if (!chats.length) {
      sendResponse(res, 404, false, "No private chats found");
      return;
    }

    sendResponse(res, 200, true, "Private chats fetched successfully", { chats });
  }
);

/**
 * @desc    Get chat history for a group
 * @route   GET /chat/history/:groupId
 * @access  Private
 */
export const getChatHistory = catchAsync(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { groupId } = req.params;

    if (!groupId.match(/^[0-9a-fA-F]{24}$/)) {
      sendResponse(res, 400, false, "Invalid group ID");
      return;
    }

    const messages = await Chat.find({ group: groupId }).sort({ createdAt: 1 });

    if (!messages.length) {
      sendResponse(res, 404, false, "No chat history found");
      return;
    }

    sendResponse(res, 200, true, "Chat history fetched successfully", {
      messages,
    });
  }
);

/**
 * @desc    Create a chat group
 * @route   POST /chat/group
 * @access  Private
 */
export const createGroup = catchAsync(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { name, members } = sanitize(req.body);
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    if (!name || !members || !Array.isArray(members)) {
      sendResponse(res, 400, false, "Group name and members are required");
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!members.includes(userId)) {
      members.push(userId); // Ensure the creator is added to the group
    }

    const memberObjectIds = members.map((id: string) =>
      new mongoose.Types.ObjectId(id)
    );

    const newGroup = new Group({
      name,
      members: memberObjectIds,
      createdBy: userObjectId,
    });
    const group = await newGroup.save();

    sendResponse(res, 201, true, "Group created successfully", { group });
  }
);

/**
 * @desc    Get user's chat groups
 * @route   GET /chat/groups
 * @access  Private
 */
export const getUserGroups = catchAsync(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const groups = await Group.find({ members: userObjectId })
      .populate("members", "username")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    if (!groups.length) {
      sendResponse(res, 404, false, "No groups found for this user");
      return;
    }

    sendResponse(res, 200, true, "User groups fetched successfully", { groups });
  }
);

export function sendMessage(req: AuthenticatedRequest, res: Response<any, Record<string, any>>, next: NextFunction) {
  throw new Error("Function not implemented.");
}
