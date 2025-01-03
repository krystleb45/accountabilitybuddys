import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import User from "../models/User";
import sanitize from "mongo-sanitize";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

/**
 * @desc Create a new post
 * @route POST /api/posts
 * @access Private
 */
export const createPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const content = sanitize(req.body.content);
    const userId = req.user?.id;

    if (!content || content.trim() === "") {
      sendResponse(res, 400, false, "Post content cannot be empty");
      return;
    }

    if (content.length > 500) {
      sendResponse(res, 400, false, "Post content exceeds the 500-character limit");
      return;
    }

    const newPost = new Post({ user: userId, content });
    await newPost.save();
    await newPost.populate("user", "username profilePicture");

    sendResponse(res, 201, true, "Post created successfully", {
      post: newPost,
    });
  }
);

/**
 * @desc Get the user's feed
 * @route GET /api/posts/feed
 * @access Private
 */
export const getFeed = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const userId = req.user?.id;

    const user = await User.findById(userId)
      .select("friends")
      .populate("friends", "_id");

    if (!user || !user.friends || user.friends.length === 0) {
      sendResponse(res, 200, true, "No friends found", { posts: [] });
      return;
    }

    const posts = await Post.find({ user: { $in: user.friends } })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: { $in: user.friends } });

    sendResponse(res, 200, true, "Feed fetched successfully", {
      posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  }
);

/**
 * @desc Get a single post by ID
 * @route GET /api/posts/:postId
 * @access Private
 */
export const getPostById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "user",
      "username profilePicture"
    );

    if (!post) {
      sendResponse(res, 404, false, "Post not found");
      return;
    }

    sendResponse(res, 200, true, "Post fetched successfully", { post });
  }
);

/**
 * @desc Update a post
 * @route PUT /api/posts/:postId
 * @access Private
 */
export const updatePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const updatedContent = sanitize(req.body.content);
    const userId = req.user?.id;

    if (!updatedContent || updatedContent.trim() === "") {
      sendResponse(res, 400, false, "Updated content cannot be empty");
      return;
    }

    if (updatedContent.length > 500) {
      sendResponse(
        res,
        400,
        false,
        "Updated content exceeds the 500-character limit"
      );
      return;
    }

    const post = await Post.findOneAndUpdate(
      { _id: postId, user: userId },
      { content: updatedContent },
      { new: true }
    ).populate("user", "username profilePicture");

    if (!post) {
      sendResponse(res, 404, false, "Post not found or unauthorized action");
      return;
    }

    sendResponse(res, 200, true, "Post updated successfully", { post });
  }
);

/**
 * @desc Delete a post
 * @route DELETE /api/posts/:postId
 * @access Private
 */
export const deletePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { postId } = req.params;
    const userId = req.user?.id;

    const post = await Post.findOneAndDelete({ _id: postId, user: userId });
    if (!post) {
      sendResponse(res, 404, false, "Post not found or unauthorized action");
      return;
    }

    sendResponse(res, 200, true, "Post deleted successfully");
  }
);
