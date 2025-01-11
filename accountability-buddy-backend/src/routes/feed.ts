import express, { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware";

import * as feedController from "../controllers/feedController";
import FeedPost from "../models/FeedPost";

const router: Router = express.Router();

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return; // Explicit return to satisfy TS rules
  }
  next();
};

// Rate limiter to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, msg: "Too many requests. Please try again later." },
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
    check("message", "Message must not exceed 500 characters")
      .optional()
      .isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      feedController.createPost(req, res, next); // Pass `next` to the controller
    } catch (err) {
      next(err); // Forward errors to error middleware
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Call the getFeed function
      await feedController.getFeed(req, res, next); // Use `await` to handle async
    } catch (err) {
      next(err); // Forward errors to middleware
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
  async (
    req: Request<{ id: string }>, // Explicitly define 'id' as a route parameter
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const like = feedController.addLike(req, res, next); // Pass `next`
      res.status(200).json({ success: true, data: like });
    } catch (err) {
      next(err);
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    // Validate post ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ success: false, msg: "Invalid post ID" });
      return;
    }

    try {
      // Await the async function
      await feedController.removeLike(req, res, next); // Ensure await is used
    } catch (err) {
      next(err); // Forward errors to middleware
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
  async (
    req: Request<{ id: string }>, // Define 'id' as a route parameter
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const comment = feedController.addComment(req, res, next);
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
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
  async (
    req: Request<{ postId: string; commentId: string }>, // Define both 'postId' and 'commentId'
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const removedComment = feedController.removeComment(req, res, next);
      res.status(200).json({ success: true, data: removedComment });
    } catch (err) {
      next(err);
    }
  }
);


/**
 * @route   DELETE /post/:id
 * @desc    Delete a post (Admin/Moderator only)
 * @access  Private
 */
export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Extract 'id'
    const userId = req.user?.id; // Get user ID

    // Ensure userId exists
    if (!userId) {
      res.status(401).json({ success: false, msg: "Unauthorized" });
      return; // Early exit without returning a value
    }

    // Check if post exists
    const post = await FeedPost.findById(id);
    if (!post) {
      res.status(404).json({ success: false, msg: "Post not found" });
      return; // Early exit without returning a value
    }

    // Check if user has permission to delete
    if (post.user.toString() !== userId && !req.user?.isAdmin) {
      res.status(403).json({ success: false, msg: "Forbidden" });
      return; // Early exit without returning a value
    }

    // Delete the post
    await post.deleteOne();

    res.status(200).json({ success: true, msg: "Post deleted successfully" });
  } catch (err) {
    next(err); // Pass errors to middleware
  }
};






export default router;
