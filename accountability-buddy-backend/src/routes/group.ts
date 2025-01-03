import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import checkSubscription from "../middleware/checkSubscription"; // Corrected subscription middleware import path
import * as groupController from "../controllers/groupController"; // Corrected controller import path
import Group from "../models/Group"; // Corrected model import path
import logger from "../utils/winstonLogger"; // Added logger utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of group-related endpoints.
 */
const groupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per window
  message: "Too many requests, please try again later.",
});

/**
 * Middleware for handling validation errors.
 */
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @route   POST /group/create
 * @desc    Create a new group (Standard and Premium Users Only)
 * @access  Private
 */
router.post(
  "/create",
  authMiddleware,
  checkSubscription("standard"),
  groupLimiter,
  [
    check("name", "Group name is required").notEmpty(),
    check("name", "Group name must not exceed 100 characters").isLength({
      max: 100,
    }),
    check("interests", "Group interests must be an array").isArray(),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, interests } = sanitize(req.body);

    try {
      const group = new Group({
        name,
        interests,
        createdBy: req.user.id,
      });
      await group.save();
      res.status(201).json({ success: true, group });
    } catch (err) {
      logger.error("Error creating group", {
        error: err,
        userId: req.user.id,
      });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   POST /group/join
 * @desc    Join an existing group
 * @access  Private
 */
router.post(
  "/join",
  authMiddleware,
  groupLimiter,
  [check("groupId", "Group ID is required").notEmpty().isMongoId()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { groupId } = sanitize(req.body);

    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, msg: "Group not found" });
      }

      if (group.members.includes(req.user.id)) {
        return res
          .status(400)
          .json({ success: false, msg: "You are already a member of this group" });
      }

      group.members.push(req.user.id);
      await group.save();
      res.json({ success: true, msg: "Joined the group successfully", group });
    } catch (err) {
      logger.error("Error joining group", {
        error: err,
        groupId,
        userId: req.user.id,
      });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   POST /group/leave
 * @desc    Leave a group
 * @access  Private
 */
router.post(
  "/leave",
  authMiddleware,
  [check("groupId", "Group ID is required").notEmpty().isMongoId()],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { groupId } = sanitize(req.body);

    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, msg: "Group not found" });
      }

      group.members = group.members.filter(
        (member) => member.toString() !== req.user.id
      );
      await group.save();
      res.json({ success: true, msg: "Left the group successfully" });
    } catch (err) {
      logger.error("Error leaving group", {
        error: err,
        groupId,
        userId: req.user.id,
      });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   GET /group/my-groups
 * @desc    Get user groups (Basic and above)
 * @access  Private
 */
router.get(
  "/my-groups",
  authMiddleware,
  checkSubscription("basic"),
  async (req: Request, res: Response) => {
    try {
      const groups = await groupController.getUserGroups(req.user.id);
      res.json({ success: true, groups });
    } catch (err) {
      logger.error("Error fetching user groups", {
        error: err,
        userId: req.user.id,
      });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

export default router;
