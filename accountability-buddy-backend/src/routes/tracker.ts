import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import * as TrackerController from "../controllers/TrackerController"; // Correct controller import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Logging utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of tracker routes.
 */
const trackerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per IP per window
  message: "Too many requests. Please try again later.",
});

/**
 * Utility for consistent error handling.
 */
const handleError = (error: unknown, res: Response, defaultMessage: string): void => {
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
  logger.error(`${defaultMessage}: ${errorMessage}`);
  res.status(500).json({ success: false, message: defaultMessage, error: errorMessage });
};

/**
 * @route   GET /tracker
 * @desc    Get tracking data for the authenticated user
 * @access  Private
 */
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const trackerData = await TrackerController.getTrackingData(req.user?.id as string);
    res.status(200).json({ success: true, trackerData });
  } catch (error) {
    handleError(error, res, "Error fetching tracking data");
  }
});

/**
 * @route   POST /tracker/add
 * @desc    Add tracking data for the authenticated user
 * @access  Private
 */
router.post(
  "/add",
  authMiddleware,
  trackerRateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const trackingData = req.body;

      if (!trackingData || Object.keys(trackingData).length === 0) {
        return res.status(400).json({ success: false, message: "Tracking data is required." });
      }

      const addedData = await TrackerController.addTrackingData(req.user?.id as string, trackingData);
      res.status(201).json({ success: true, message: "Tracking data added successfully.", data: addedData });
    } catch (error) {
      handleError(error, res, "Error adding tracking data");
    }
  }
);

/**
 * @route   DELETE /tracker/delete
 * @desc    Delete tracking data by ID for the authenticated user
 * @access  Private
 */
router.delete(
  "/delete",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { dataId }: { dataId: string } = req.body;

      if (!dataId) {
        return res.status(400).json({ success: false, message: "Data ID is required." });
      }

      const result = await TrackerController.deleteTrackingData(req.user?.id as string, dataId);
      res.status(200).json({ success: true, message: "Tracking data deleted successfully.", result });
    } catch (error) {
      handleError(error, res, "Error deleting tracking data");
    }
  }
);

export default router;
