import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import authMiddleware from "../middleware/authMiddleware";
import rateLimit from "express-rate-limit";
import { getUserProfile, updateUserProfile, changePassword, deleteUserAccount } from "../controllers/UserController";
import logger from "../utils/winstonLogger";

const router = express.Router();

// Rate limiters for sensitive routes
const sensitiveOperationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests. Please try again later."
});

// @route   GET /user/profile
// @desc    Get the user's profile
// @access  Private
router.get(
  "/profile",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await getUserProfile(req.user.id); // Assuming req.user contains the authenticated user's data
      res.status(200).json(profile);
    } catch (error) {
      logger.error("Error fetching user profile: ", error);
      next(error);
    }
  }
);

// @route   PUT /user/profile
// @desc    Update the user's profile
// @access  Private
router.put(
  "/profile",
  authMiddleware,
  [
    check("email", "Invalid email").optional().isEmail(),
    check("username", "Username cannot be empty").optional().notEmpty()
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const sanitizedBody = sanitize(req.body);
      const updatedProfile = await updateUserProfile(req.user.id, sanitizedBody);
      res.status(200).json(updatedProfile);
    } catch (error) {
      logger.error("Error updating user profile: ", error);
      next(error);
    }
  }
);

// @route   PATCH /user/password
// @desc    Change the user's password
// @access  Private
router.patch(
  "/password",
  authMiddleware,
  sensitiveOperationLimiter,
  [
    check("currentPassword", "Current password is required").notEmpty(),
    check("newPassword", "New password must be at least 8 characters").isLength({ min: 8 })
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = sanitize(req.body);
      await changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      logger.error("Error changing password: ", error);
      next(error);
    }
  }
);

// @route   DELETE /user/account
// @desc    Delete the user's account
// @access  Private
router.delete(
  "/account",
  authMiddleware,
  sensitiveOperationLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUserAccount(req.user.id);
      res.status(200).json({ message: "Account deleted successfully." });
    } catch (error) {
      logger.error("Error deleting user account: ", error);
      next(error);
    }
  }
);

export default router;
