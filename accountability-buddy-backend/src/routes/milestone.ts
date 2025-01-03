import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import * as MilestoneController from "../controllers/MilestoneController"; // Corrected controller import path
import logger from "../utils/winstonLogger"; // Added logger utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of milestone-related endpoints.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per window
  message: "Too many requests. Please try again later.",
});

/**
 * @route   GET /milestones
 * @desc    Get user milestones
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const milestones = await MilestoneController.getUserMilestones(userId);
      res.status(200).json({ success: true, milestones });
    } catch (error) {
      logger.error("Error fetching milestones", {
        error: error,
        userId: req.user?.id,
        ip: req.ip,
      });
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   POST /milestones/add
 * @desc    Add a new milestone
 * @access  Private
 */
router.post(
  "/add",
  authMiddleware,
  rateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const milestoneData = req.body;
      const newMilestone = await MilestoneController.addMilestone(userId, milestoneData);
      res.status(201).json({ success: true, message: "Milestone added successfully.", newMilestone });
    } catch (error) {
      logger.error("Error adding milestone", {
        error: error,
        userId: req.user?.id,
        ip: req.ip,
      });
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   PUT /milestones/update
 * @desc    Update a milestone
 * @access  Private
 */
router.put(
  "/update",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { milestoneId, updates } = req.body;
      const updatedMilestone = await MilestoneController.updateMilestone(userId, milestoneId, updates);
      res.status(200).json({ success: true, message: "Milestone updated successfully.", updatedMilestone });
    } catch (error) {
      logger.error("Error updating milestone", {
        error: error,
        userId: req.user?.id,
        milestoneId: req.body.milestoneId,
        ip: req.ip,
      });
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   DELETE /milestones/delete
 * @desc    Delete a milestone
 * @access  Private
 */
router.delete(
  "/delete",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { milestoneId } = req.body;
      const result = await MilestoneController.deleteMilestone(userId, milestoneId);
      res.status(200).json({ success: true, message: "Milestone deleted successfully.", result });
    } catch (error) {
      logger.error("Error deleting milestone", {
        error: error,
        userId: req.user?.id,
        milestoneId: req.body.milestoneId,
        ip: req.ip,
      });
      next(error); // Pass error to global error handler
    }
  }
);

export default router;
