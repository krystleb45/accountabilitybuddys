import { Request, Response, NextFunction } from "express";
import Tracker from "../models/Tracker"; // Database model for tracker
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";


// Extend Express Request to include 'user'
interface CustomRequest extends Request {
  user?: { id: string }; // Assuming the user object has an 'id' property
}

/**
 * @desc Fetch all trackers
 * @route GET /api/trackers
 * @access Private
 */
export const getAllTrackers = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const trackers = await Tracker.find({ user: userId }).sort({ createdAt: -1 });

    sendResponse(res, 200, true, "Trackers fetched successfully", trackers);
  }
);

/**
 * @desc Create a new tracker
 * @route POST /api/trackers
 * @access Private
 */
export const createTracker = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    if (!name) {
      sendResponse(res, 400, false, "Tracker name is required");
      return;
    }

    const newTracker = await Tracker.create({ user: userId, name, progress: 0 });

    sendResponse(res, 201, true, "Tracker created successfully", newTracker);
  }
);

/**
 * @desc Update a tracker
 * @route PUT /api/trackers/:id
 * @access Private
 */
export const updateTracker = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { progress } = req.body;

    if (!userId) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    if (progress === undefined || typeof progress !== "number") {
      sendResponse(res, 400, false, "Progress must be a number");
      return;
    }

    const updatedTracker = await Tracker.findOneAndUpdate(
      { _id: id, user: userId },
      { progress },
      { new: true } // Return the updated document
    );

    if (!updatedTracker) {
      sendResponse(res, 404, false, "Tracker not found");
      return;
    }

    sendResponse(res, 200, true, "Tracker updated successfully", updatedTracker);
  }
);

/**
 * @desc Delete a tracker
 * @route DELETE /api/trackers/:id
 * @access Private
 */
export const deleteTracker = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const deletedTracker = await Tracker.findOneAndDelete({ _id: id, user: userId });

    if (!deletedTracker) {
      sendResponse(res, 404, false, "Tracker not found");
      return;
    }

    sendResponse(res, 200, true, "Tracker deleted successfully");
  }
);
