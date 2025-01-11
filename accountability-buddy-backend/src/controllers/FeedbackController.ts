import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import FeedPost, { IFeedPost } from "../models/FeedPost";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";

// Extended Request type for user property
interface RequestWithUser extends Request {
  user?: {
    id: string;
    email?: string;
    role: "user" | "admin" | "moderator";
    isAdmin?: boolean;
  };
}

/**
 * @desc    Create a new milestone post
 * @route   POST /api/feed
 * @access  Private
 */
export const createPost = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const { goalId, milestone, message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
      sendResponse(res, 400, false, "Post message cannot be empty");
      return;
    }

    const newPost = await FeedPost.create({
      user: new mongoose.Types.ObjectId(userId),
      goal: goalId,
      milestone,
      message,
      likes: [],
      comments: [],
    });

    logger.info(`Milestone post created by user: ${userId}`);
    sendResponse(res, 201, true, "Milestone shared successfully", {
      post: newPost,
    });
  }
);

/**
 * @desc    Add a like to a post
 * @route   POST /api/feed/:id/like
 * @access  Private
 */
export const addLike = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const postId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    const post = (await FeedPost.findById(postId)) as IFeedPost | null;
    if (!post) {
      sendResponse(res, 404, false, "Post not found");
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (post.likes.some((likeId) => likeId.equals(userObjectId))) {
      sendResponse(res, 400, false, "You have already liked this post");
      return;
    }

    post.likes.push(userObjectId);
    await post.save();

    logger.info(`Post liked by user: ${userId}`);
    sendResponse(res, 200, true, "Post liked successfully", { post });
  }
);

/**
 * @desc    Add a comment to a post
 * @route   POST /api/feed/:id/comment
 * @access  Private
 */
export const addComment = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    if (!text || typeof text !== "string" || text.trim() === "") {
      sendResponse(res, 400, false, "Comment cannot be empty");
      return;
    }

    const post = (await FeedPost.findById(postId)) as IFeedPost | null;
    if (!post) {
      sendResponse(res, 404, false, "Post not found");
      return;
    }

    post.comments.push({
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(userId),
      text,
    });
    await post.save();

    logger.info(`Comment added by user: ${userId} to post: ${postId}`);
    sendResponse(res, 201, true, "Comment added successfully", { post });
  }
);

/**
 * @desc    Remove a comment from a post
 * @route   DELETE /api/feed/:postId/comment/:commentId
 * @access  Private
 */
export const removeComment = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const { postId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    const post = (await FeedPost.findById(postId)) as IFeedPost | null;
    if (!post) {
      sendResponse(res, 404, false, "Post not found");
      return;
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      sendResponse(res, 404, false, "Comment not found");
      return;
    }

    const comment = post.comments[commentIndex];
    const isAdmin = req.user?.isAdmin || false;

    if (comment.user.toString() !== userId && post.user.toString() !== userId && !isAdmin) {
      sendResponse(res, 403, false, "Unauthorized action");
      return;
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    logger.info(`Comment removed by user: ${userId} from post: ${postId}`);
    sendResponse(res, 200, true, "Comment removed successfully", { post });
  }
);
/**
 * @desc    Get feedback submitted by the authenticated user
 * @route   GET /api/feedback
 * @access  Private
 */
export const getUserFeedback = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    // Mock fetching feedback (replace with actual DB query)
    const feedback = [
      { id: "1", message: "Great feature!", type: "feature-request" },
      { id: "2", message: "Bug detected in dashboard", type: "bug" },
    ];

    logger.info(`Feedback fetched for user: ${userId}`);
    sendResponse(res, 200, true, "Feedback retrieved successfully", { feedback });
  }
);
/**
 * @desc    Delete feedback by ID
 * @route   DELETE /api/feedback/:feedbackId
 * @access  Private
 */
export const deleteFeedback = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const { feedbackId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    // Validate feedback ID format
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      sendResponse(res, 400, false, "Invalid feedback ID");
      return;
    }

    // Mock feedback deletion (replace with actual DB query)
    const deleted = true; // Simulate successful deletion
    if (!deleted) {
      sendResponse(res, 404, false, "Feedback not found");
      return;
    }

    logger.info(`Feedback deleted by user: ${userId}, ID: ${feedbackId}`);
    sendResponse(res, 200, true, "Feedback deleted successfully");
  }
);

/**
 * @desc    Submit feedback
 * @route   POST /api/feedback
 * @access  Private
 */
export const submitFeedback = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const { message, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }

    // Mock feedback submission
    logger.info(`Feedback submitted by user: ${userId}`);
    sendResponse(res, 201, true, "Feedback submitted successfully", {
      message,
      type,
    });
  }
);

export default {
  createPost,
  addLike,
  addComment,
  removeComment,
  getUserFeedback,
  deleteFeedback,
  submitFeedback,
};
