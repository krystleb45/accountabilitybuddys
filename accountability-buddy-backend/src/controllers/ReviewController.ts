import { Request, Response, NextFunction } from "express";
import User from "../models/User"; 
import Review from "../models/Review"; // assuming you have a Review model
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";


/**
 * @desc Submit a review
 * @route POST /api/reviews
 * @access Private
 */
export const submitReview = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const { userId, rating, content } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      sendResponse(res, 400, false, "Rating must be between 1 and 5");
      return;
    }

    // Validate content
    if (!content || content.trim() === "") {
      sendResponse(res, 400, false, "Review content cannot be empty");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    if (userId === req.user.id) {
      sendResponse(res, 400, false, "You cannot review yourself");
      return;
    }

    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      reviewee: userId,
    });
    if (existingReview) {
      sendResponse(res, 400, false, "You have already submitted a review for this user");
      return;
    }

    const newReview = await Review.create({
      reviewer: req.user.id,
      reviewee: userId,
      rating,
      content,
    });

    sendResponse(res, 201, true, "Review submitted successfully", {
      review: newReview,
    });
  }
);

/**
 * @desc Get reviews for a user
 * @route GET /api/reviews/:userId
 * @access Public or Private (depending on your logic)
 */
export const getUserReviews = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    const reviews = await Review.find({ reviewee: userId }).populate("reviewer", "username");

    sendResponse(res, 200, true, "User reviews fetched successfully", { reviews });
  }
);

/**
 * @desc Delete a review
 * @route DELETE /api/reviews/:reviewId
 * @access Private
 */
export const deleteReview = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      reviewer: req.user.id, // ensures user can only delete their own reviews
    });
    if (!review) {
      sendResponse(res, 404, false, "Review not found or access denied");
      return;
    }

    sendResponse(res, 200, true, "Review deleted successfully");
  }
);
