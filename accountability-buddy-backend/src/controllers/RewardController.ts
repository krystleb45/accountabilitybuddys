import { Response } from "express";
import User from "../models/User";
import Review from "../models/Review";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

/**
 * @desc Award points to a user
 * @param userId - ID of the user
 * @param points - Number of points to award
 */
export const awardPoints = async (userId: string, points: number): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.points = (user.points || 0) + points;
  await user.save();
};

/**
 * @desc Submit a review
 * @route POST /api/reviews
 * @access Private
 */
export const submitReview = catchAsync(
  async (
    req: CustomRequest<{}, any, { userId: string; rating: number; content: string }>,
    res: Response
  ): Promise<void> => {
    const { userId, rating, content } = req.body;
    const reviewerId = req.user?.id;

    if (rating < 1 || rating > 5) {
      sendResponse(res, 400, false, "Rating must be between 1 and 5");
      return;
    }

    if (!content || content.trim() === "") {
      sendResponse(res, 400, false, "Review content cannot be empty");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    if (userId === reviewerId) {
      sendResponse(res, 400, false, "You cannot review yourself");
      return;
    }

    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      reviewee: userId,
    });
    if (existingReview) {
      sendResponse(res, 400, false, "You have already submitted a review for this user");
      return;
    }

    const newReview = await Review.create({
      reviewer: reviewerId,
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
 * @access Public
 */
export const getUserReviews = catchAsync(
  async (
    req: CustomRequest<{ userId: string }>,
    res: Response
  ): Promise<void> => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    const reviews = await Review.find({ reviewee: userId }).populate(
      "reviewer",
      "username profilePicture"
    );

    sendResponse(res, 200, true, "User reviews fetched successfully", { reviews });
  }
);

/**
 * @desc Delete a review
 * @route DELETE /api/reviews/:reviewId
 * @access Private
 */
export const deleteReview = catchAsync(
  async (
    req: CustomRequest<{ reviewId: string }>,
    res: Response
  ): Promise<void> => {
    const { reviewId } = req.params;
    const reviewerId = req.user?.id;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      reviewer: reviewerId,
    });

    if (!review) {
      sendResponse(res, 404, false, "Review not found or access denied");
      return;
    }

    sendResponse(res, 200, true, "Review deleted successfully");
  }
);

/**
 * NOTE: Group export REMOVED to prevent duplication errors.
 */
