import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import CollaborationGoal from "../models/CollaborationGoal";
import authMiddleware from "../middleware/authMiddleware";
import catchAsync from "../utils/catchAsync";

const router = express.Router();

// Middleware for validating goal creation inputs
const validateGoalCreation = [
  check("goalTitle", "Goal title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  check("participants", "Participants must be an array").isArray(),
  check("target", "Target is required and must be a number greater than 0").isInt({ min: 1 }),
];

// Middleware for progress update validation
const validateProgressUpdate = [
  check("progress", "Progress must be a number").isInt({ min: 0 }),
];

// Rate limiter to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests. Please try again later.",
});

/**
 * @route   POST /create
 * @desc    Create a new collaboration goal
 * @access  Private
 */
router.post(
  "/create",
  rateLimiter,
  authMiddleware,
  validateGoalCreation,
  catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { goalTitle, description, participants, target } = req.body;

    const newGoal = new CollaborationGoal({
      goalTitle,
      description,
      createdBy: req.user?.id,
      participants: [req.user?.id, ...participants],
      target,
    });

    await newGoal.save();
    res.status(201).json({ success: true, goal: newGoal });
  })
);

/**
 * @route   PUT /:id/update-progress
 * @desc    Update progress on a collaboration goal
 * @access  Private
 */
router.put(
  "/:id/update-progress",
  rateLimiter,
  authMiddleware,
  validateProgressUpdate,
  catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { progress } = req.body;
    const goal = await CollaborationGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    // Ensure only participants or the creator can update progress
    if (
      !goal.participants.includes(req.user?.id) &&
      goal.createdBy.toString() !== req.user?.id
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this goal" });
    }

    goal.progress = progress;
    await goal.save();

    res.status(200).json({ success: true, goal });
  })
);

/**
 * @route   GET /my-goals
 * @desc    Fetch all collaboration goals for the authenticated user
 * @access  Private
 */
router.get(
  "/my-goals",
  rateLimiter,
  authMiddleware,
  catchAsync(async (req: Request, res: Response) => {
    const goals = await CollaborationGoal.find({
      $or: [{ participants: req.user?.id }, { createdBy: req.user?.id }],
    }).sort({ createdAt: -1 });

    if (!goals.length) {
      return res.status(404).json({ success: false, message: "No collaboration goals found" });
    }

    res.status(200).json({ success: true, goals });
  })
);

/**
 * @route   GET /:id
 * @desc    Fetch a specific collaboration goal by ID
 * @access  Private
 */
router.get(
  "/:id",
  rateLimiter,
  authMiddleware,
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid goal ID" });
    }

    const goal = await CollaborationGoal.findById(id)
      .populate("participants", "username")
      .populate("createdBy", "username");

    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    // Ensure only participants or the creator can view the goal
    if (
      !goal.participants.includes(req.user?.id) &&
      goal.createdBy._id.toString() !== req.user?.id
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this goal" });
    }

    res.status(200).json({ success: true, goal });
  })
);

export default router;
