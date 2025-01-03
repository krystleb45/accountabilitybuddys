import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import FeedPost, { IFeedPost } from "../models/FeedPost";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";

/**
 * @desc    Create a new post
 * @route   POST /api/feed
 * @access  Private
 */
export const createPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      sendResponse(res, 400, false, "Post content cannot be empty");
      return;
    }

    const newPost = await FeedPost.create({
      user: new mongoose.Types.ObjectId(userId),
      content,
      likes: [],
      comments: [],
    });
    logger.info(`Post created by user: ${userId}`);
    sendResponse(res, 201, true, "Post created successfully", { post: newPost });
  }
);

/**
 * @desc    Add a like to a post
 * @route   POST /api/feed/:postId/like
 * @access  Private
 */
export const addLike = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
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

    logger.info(`User ${userId} liked post: ${postId}`);
    sendResponse(res, 200, true, "Post liked successfully", { post });
  }
);

/**
 * @desc    Add a comment to a post
 * @route   POST /api/feed/:postId/comment
 * @access  Private
 */
export const addComment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
      return;
    }

    if (!text || typeof text !== "string" || text.trim() === "") {
      sendResponse(res, 400, false, "Comment text cannot be empty");
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

    logger.info(`User ${userId} commented on post: ${postId}`);
    sendResponse(res, 201, true, "Comment added successfully", { post });
  }
);

/**
 * @desc    Remove a comment from a post
 * @route   DELETE /api/feed/:postId/comment/:commentId
 * @access  Private
 */
export const removeComment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { postId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 400, false, "User ID is required");
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
    // Ensure user is either admin or the owner of the comment
    if (comment.user.toString() !== userId && !req.user?.isAdmin) {
      sendResponse(res, 403, false, "You are not authorized to remove this comment");
      return;
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    logger.info(`User ${userId} removed a comment from post: ${postId}`);
    sendResponse(res, 200, true, "Comment removed successfully", { post });
  }
);

export default {
  createPost,
  addLike,
  addComment,
  removeComment,
};
