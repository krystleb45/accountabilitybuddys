import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import * as feedController from "../controllers/feedController";

const router = express.Router();

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: () => void): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Rate limiter to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests. Please try again later.",
});

/**
 * @route   POST /post
 * @desc    Create a new post (e.g., for sharing milestones)
 * @access  Private
 */
router.post(
  "/post",
  rateLimiter,
  authMiddleware,
  [
    check("goalId", "Goal ID is required").notEmpty().isMongoId(),
    check("milestone", "Milestone title is required").notEmpty(),
    check("message", "Message must not exceed 500 characters").optional().isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      await feedController.createPost(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   GET /
 * @desc    Get all posts (feed)
 * @access  Private
 */
router.get(
  "/",
  rateLimiter,
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      await feedController.getFeed(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   POST /like/:id
 * @desc    Like a post
 * @access  Private
 */
router.post(
  "/like/:id",
  rateLimiter,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid post ID" });
    }

    try {
      await feedController.addLike(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   DELETE /unlike/:id
 * @desc    Remove a like from a post
 * @access  Private
 */
router.delete(
  "/unlike/:id",
  rateLimiter,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid post ID" });
    }

    try {
      await feedController.removeLike(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   POST /comment/:id
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post(
  "/comment/:id",
  rateLimiter,
  authMiddleware,
  [
    check("text", "Comment must not be empty").notEmpty(),
    check("text", "Comment must not exceed 200 characters").isLength({ max: 200 }),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid post ID" });
    }

    try {
      await feedController.addComment(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   DELETE /comment/:postId/:commentId
 * @desc    Remove a comment from a post
 * @access  Private
 */
router.delete(
  "/comment/:postId/:commentId",
  rateLimiter,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    if (!postId.match(/^[0-9a-fA-F]{24}$/) || !commentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid post or comment ID" });
    }

    try {
      await feedController.removeComment(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   POST /report/:id
 * @desc    Report a post
 * @access  Private
 */
router.post(
  "/report/:id",
  rateLimiter,
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid post ID" });
    }

    try {
      await feedController.reportPost(req, res);
      res.json({ success: true, msg: "Post reported successfully" });
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

/**
 * @route   DELETE /post/:id
 * @desc    Delete a post (Admin/Moderator only)
 * @access  Private
 */
router.delete(
  "/post/:id",
  rateLimiter,
  authMiddleware,
  roleBasedAccessControl(["admin", "moderator"]),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid post ID" });
    }

    try {
      await feedController.deletePost(req, res);
    } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: (err as Error).message });
    }
  }
);

export default router;
