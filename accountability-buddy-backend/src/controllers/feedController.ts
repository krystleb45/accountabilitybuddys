import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import FeedPost from "../models/FeedPost";
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

    // Validate user
    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return; // No `return sendResponse()`, just `return;` to avoid type mismatch
    }

    // Validate message
    if (!message || typeof message !== "string" || message.trim() === "") {
      sendResponse(res, 400, false, "Post message cannot be empty");
      return;
    }

    // Create post
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

    // Validate user
    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    // Check if post exists
    const post = await FeedPost.findById(postId);
    if (!post) {
      sendResponse(res, 404, false, "Post not found");
      return;
    }

    // Check if user has already liked the post
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

    // Validate user
    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    // Validate comment
    if (!text || typeof text !== "string" || text.trim() === "") {
      sendResponse(res, 400, false, "Comment cannot be empty");
      return;
    }

    const post = await FeedPost.findById(postId);
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
 * @desc    Get all posts (feed)
 * @route   GET /api/feed
 * @access  Private
 */
export const getFeed = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.id;

    // Validate user
    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    // Fetch feed posts sorted by most recent
    const feedPosts = await FeedPost.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email") // Populate user details
      .populate("comments.user", "username email"); // Populate comment authors

    logger.info(`Feed fetched by user: ${userId}`);
    sendResponse(res, 200, true, "Feed fetched successfully", { feed: feedPosts });
  }
);
/**
 * @desc    Remove a like from a post
 * @route   DELETE /api/feed/:id/unlike
 * @access  Private
 */
export const removeLike = catchAsync(
  async (
    req: RequestWithUser,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const { id } = req.params; // Extract post ID
    const userId = req.user?.id;

    // Validate user
    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    // Validate post ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendResponse(res, 400, false, "Invalid post ID");
      return;
    }

    // Find the post
    const post = await FeedPost.findById(id);
    if (!post) {
      sendResponse(res, 404, false, "Post not found");
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    // Check if the user has liked the post
    const likeIndex = post.likes.findIndex((likeId) =>
      likeId.equals(userObjectId)
    );

    if (likeIndex === -1) {
      sendResponse(res, 400, false, "You have not liked this post");
      return;
    }

    // Remove like
    post.likes.splice(likeIndex, 1);
    await post.save();

    logger.info(`Post unliked by user: ${userId}`);
    sendResponse(res, 200, true, "Like removed successfully", { post });
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

    // Validate user
    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    const post = await FeedPost.findById(postId);
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
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      sendResponse(res, 403, false, "Unauthorized action");
      return;
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    logger.info(`Comment removed by user: ${userId} from post: ${postId}`);
    sendResponse(res, 200, true, "Comment removed successfully", { post });
  }
);

export default {
  createPost,
  addLike,
  addComment,
  removeComment,
  getFeed,
  removeLike,
};
