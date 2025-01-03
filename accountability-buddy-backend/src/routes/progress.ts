import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import * as ProgressController from "../controllers/ProgressController"; // Corrected controller import path
import logger from "../utils/winstonLogger"; // Import logger utility

const router = express.Router();

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @route   GET /progress
 * @desc    Get user progress
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const progress = await ProgressController.getProgress(req.user?.id);
      res.status(200).json({ success: true, progress });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching progress for user ${req.user?.id}: ${errorMessage}`);
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   PUT /progress/update
 * @desc    Update user progress
 * @access  Private
 */
router.put(
  "/update",
  authMiddleware,
  [
    check("goalId").notEmpty().withMessage("Goal ID is required."),
    check("progress").isNumeric().withMessage("Progress must be a numeric value."),
  ],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { goalId, progress } = req.body;
      const updatedProgress = await ProgressController.updateProgress(req.user?.id, goalId, progress);
      res.status(200).json({ success: true, message: "Progress updated successfully.", updatedProgress });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error updating progress for user ${req.user?.id}: ${errorMessage}`);
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   DELETE /progress/reset
 * @desc    Reset user progress
 * @access  Private
 */
router.delete(
  "/reset",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resetResult = await ProgressController.resetProgress(req.user?.id);
      res.status(200).json({ success: true, message: "Progress reset successfully.", resetResult });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error resetting progress for user ${req.user?.id}: ${errorMessage}`);
      next(error); // Pass error to global error handler
    }
  }
);

export default router;
