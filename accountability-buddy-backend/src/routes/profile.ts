import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import * as ProfileController from "../controllers/ProfileController"; // Corrected controller import path
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
 * @route   GET /profile
 * @desc    Get user profile
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await ProfileController.getProfile(req.user?.id);
      res.status(200).json({ success: true, profile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching profile for user ${req.user?.id}: ${errorMessage}`);
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   PUT /profile/update
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/update",
  authMiddleware,
  [
    check("name").optional().isString().withMessage("Name must be a string."),
    check("email").optional().isEmail().withMessage("Email must be valid."),
  ],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedProfile = await ProfileController.updateProfile(req.user?.id, req.body);
      res.status(200).json({ success: true, message: "Profile updated successfully.", updatedProfile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error updating profile for user ${req.user?.id}: ${errorMessage}`);
      next(error); // Pass error to global error handler
    }
  }
);

export default router;
