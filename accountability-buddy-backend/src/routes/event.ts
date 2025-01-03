import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import Event from "../models/Event";
import authMiddleware from "../middleware/authMiddleware";
import catchAsync from "../utils/catchAsync";

const router = express.Router();

// Middleware for validating event creation inputs
const validateEventCreation = [
  check("eventTitle", "Event title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  check("date", "A valid date is required").isISO8601(),
  check("participants", "Participants must be an array").isArray(),
  check("location", "Location is required").notEmpty(),
];

// Middleware for progress update validation
const validateEventProgress = [
  check("progress", "Progress must be a number between 0 and 100").isInt({ min: 0, max: 100 }),
];

// Rate limiter to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests. Please try again later.",
});

/**
 * @route   POST /create
 * @desc    Create a new event
 * @access  Private
 */
router.post(
  "/create",
  rateLimiter,
  authMiddleware,
  validateEventCreation,
  catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { eventTitle, description, date, participants, location } = req.body;

    const newEvent = new Event({
      eventTitle,
      description,
      date,
      createdBy: req.user?.id,
      participants: [req.user?.id, ...participants],
      location,
    });

    await newEvent.save();
    res.status(201).json({ success: true, event: newEvent });
  })
);

/**
 * @route   PUT /:id/update-progress
 * @desc    Update progress on an event
 * @access  Private
 */
router.put(
  "/:id/update-progress",
  rateLimiter,
  authMiddleware,
  validateEventProgress,
  catchAsync(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { progress } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Ensure only participants or the creator can update progress
    if (
      !event.participants.includes(req.user?.id) &&
      event.createdBy.toString() !== req.user?.id
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this event" });
    }

    event.progress = progress;
    await event.save();

    res.status(200).json({ success: true, event });
  })
);

/**
 * @route   GET /my-events
 * @desc    Fetch all events for the authenticated user
 * @access  Private
 */
router.get(
  "/my-events",
  rateLimiter,
  authMiddleware,
  catchAsync(async (req: Request, res: Response) => {
    const events = await Event.find({
      $or: [{ participants: req.user?.id }, { createdBy: req.user?.id }],
    }).sort({ createdAt: -1 });

    if (!events.length) {
      return res.status(404).json({ success: false, message: "No events found" });
    }

    res.status(200).json({ success: true, events });
  })
);

/**
 * @route   GET /:id
 * @desc    Fetch a specific event by ID
 * @access  Private
 */
router.get(
  "/:id",
  rateLimiter,
  authMiddleware,
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findById(id)
      .populate("participants", "username")
      .populate("createdBy", "username");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Ensure only participants or the creator can view the event
    if (
      !event.participants.includes(req.user?.id) &&
      event.createdBy.toString() !== req.user?.id
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this event" });
    }

    res.status(200).json({ success: true, event });
  })
);

export default router;
