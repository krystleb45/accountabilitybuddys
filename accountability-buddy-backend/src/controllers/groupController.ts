import { Response } from "express";
import mongoose from "mongoose";
import { Group } from "../models/Group";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { createError } from "../middleware/errorHandler";

/**
 * @desc Create a new group
 * @route POST /api/groups
 * @access Private
 */
export const createGroup = catchAsync(
  async (
    req: CustomRequest<{}, any, { name: string; members: string[] }>,
    res: Response
  ): Promise<void> => {
    const { name, members } = req.body;
    const userId = req.user?.id;

    if (!name || !name.trim()) {
      throw createError("Group name is required", 400);
    }

    // Ensure unique members, including the creator
    const uniqueMembers = [...new Set([userId, ...members])].map(
      (id) => new mongoose.Types.ObjectId(String(id))
    );

    const newGroup = new Group({
      name,
      members: uniqueMembers,
      createdBy: new mongoose.Types.ObjectId(userId),
    });
    await newGroup.save();

    sendResponse(res, 201, true, "Group created successfully", { group: newGroup });
  }
);

/**
 * @desc Get all groups a user is part of
 * @route GET /api/groups
 * @access Private
 */
export const getUserGroups = catchAsync(
  async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    const groups = await Group.find({
      members: new mongoose.Types.ObjectId(userId),
    })
      .populate("members", "username profilePicture")
      .populate("createdBy", "username profilePicture");

    sendResponse(res, 200, true, "User groups fetched successfully", { groups });
  }
);

/**
 * @desc Get a specific group by ID
 * @route GET /api/groups/:groupId
 * @access Private
 */
export const getGroupById = catchAsync(
  async (
    req: CustomRequest<{ groupId: string }>,
    res: Response
  ): Promise<void> => {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      throw createError("Invalid group ID format", 400);
    }

    const group = await Group.findById(new mongoose.Types.ObjectId(groupId))
      .populate("members", "username profilePicture")
      .populate("createdBy", "username profilePicture");

    if (!group) {
      sendResponse(res, 404, false, "Group not found");
      return;
    }

    sendResponse(res, 200, true, "Group fetched successfully", { group });
  }
);

/**
 * @desc Update a group
 * @route PUT /api/groups/:groupId
 * @access Private
 */
export const updateGroup = catchAsync(
  async (
    req: CustomRequest<{ groupId: string }, any, { name?: string; members?: string[] }>,
    res: Response
  ): Promise<void> => {
    const { groupId } = req.params;
    const { name, members } = req.body;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      throw createError("Invalid group ID format", 400);
    }

    const group = await Group.findById(new mongoose.Types.ObjectId(groupId));
    if (!group) {
      sendResponse(res, 404, false, "Group not found");
      return;
    }
    if (!group.createdBy.equals(new mongoose.Types.ObjectId(userId))) {
      sendResponse(res, 403, false, "You are not authorized to update this group");
      return;
    }

    if (name) group.name = name;
    if (members) {
      const uniqueMembers = [...new Set(members)].map(
        (id) => new mongoose.Types.ObjectId(String(id))
      );
      group.members = uniqueMembers;
    }

    await group.save();
    sendResponse(res, 200, true, "Group updated successfully", { group });
  }
);

/**
 * @desc Delete a group
 * @route DELETE /api/groups/:groupId
 * @access Private
 */
export const deleteGroup = catchAsync(
  async (
    req: CustomRequest<{ groupId: string }>,
    res: Response
  ): Promise<void> => {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      throw createError("Invalid group ID format", 400);
    }

    const group = await Group.findById(new mongoose.Types.ObjectId(groupId));
    if (!group) {
      sendResponse(res, 404, false, "Group not found");
      return;
    }
    if (!group.createdBy.equals(new mongoose.Types.ObjectId(userId))) {
      sendResponse(res, 403, false, "You are not authorized to delete this group");
      return;
    }

    await group.deleteOne();
    sendResponse(res, 200, true, "Group deleted successfully");
  }
);

/**
 * @desc Add a member to a group
 * @route POST /api/groups/add-member
 * @access Private
 */
export const addGroupMember = catchAsync(
  async (
    req: CustomRequest<{}, any, { groupId: string; memberId: string }>,
    res: Response
  ): Promise<void> => {
    const { groupId, memberId } = req.body;
    const userId = req.user?.id;

    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      throw createError("Invalid group or member ID format", 400);
    }

    const group = await Group.findById(new mongoose.Types.ObjectId(groupId));
    if (!group) {
      sendResponse(res, 404, false, "Group not found");
      return;
    }
    if (!group.members.some((id) => id.equals(new mongoose.Types.ObjectId(userId)))) {
      sendResponse(res, 403, false, "You are not authorized to add members to this group");
      return;
    }

    const memberObjectId = new mongoose.Types.ObjectId(memberId);
    if (!group.members.some((id) => id.equals(memberObjectId))) {
      group.members.push(memberObjectId);
      await group.save();
    }

    sendResponse(res, 200, true, "Member added successfully", { group });
  }
);
