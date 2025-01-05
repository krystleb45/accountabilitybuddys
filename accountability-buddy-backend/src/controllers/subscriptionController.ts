import { Request, Response} from "express";
import User from "../models/User";
import Subscription from "../models/Subscription"; // Assuming Subscription model exists
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";


// Helper function to sanitize input manually
const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input.replace(/[<>]/g, ""); // Sanitize strings
  }
  if (typeof input === "object" && input !== null) {
    for (const key in input) {
      input[key] = sanitizeInput(input[key]);
    }
  }
  return input;
};

/**
 * @desc Get user subscriptions
 * @route GET /api/subscriptions
 * @access Private
 */
export const getUserSubscriptions = catchAsync(
  async (
    req: Request<{}, {}, {}, {}>,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }
    const user = await User.findById(userId).populate("subscriptions");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Subscriptions fetched successfully", {
      subscriptions: user.subscriptions,
    });
  }
);

/**
 * @desc Add a subscription for the user
 * @route POST /api/subscriptions
 * @access Private
 */
export const addSubscription = catchAsync(
  async (
    req: Request<{}, {}, { subscriptionId: string }, {}>,
    res: Response
  ): Promise<void> => {
    const { subscriptionId } = sanitizeInput(req.body);
    const userId = req.user?.id;
    if (!userId) {
      sendResponse(res, 401, false, "Unauthorized");
      return;
    }


    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { subscriptions: subscriptionId } }, // Avoid duplicates
      { new: true }
    ).populate("subscriptions");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 201, true, "Subscription added successfully", {
      subscriptions: user.subscriptions,
    });
  }
);

/**
 * @desc Remove a subscription for the user
 * @route DELETE /api/subscriptions/:subscriptionId
 * @access Private
 */
export const removeSubscription = catchAsync(
  async (
    req: Request<{ subscriptionId: string }, {}, {}, {}>,
    res: Response
  ): Promise<void> => {
    const { subscriptionId } = sanitizeInput(req.params);
    const userId: string | undefined = req.user?.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { subscriptions: subscriptionId } }, // Remove specific subscription
      { new: true }
    ).populate("subscriptions");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Subscription removed successfully", {
      subscriptions: user.subscriptions,
    });
  }
);

/**
 * @desc Update subscription details
 * @route PUT /api/subscriptions/:subscriptionId
 * @access Private
 */
export const updateSubscription = catchAsync(
  async (
    req: Request<{ subscriptionId: string }, {}, {}, {}>,
    res: Response
  ): Promise<void> => {
    const { subscriptionId } = sanitizeInput(req.params);
    const updates = sanitizeInput(req.body);

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!subscription) {
      sendResponse(res, 404, false, "Subscription not found");
      return;
    }

    sendResponse(res, 200, true, "Subscription updated successfully", {
      subscription,
    });
  }
);

/**
 * @desc Get a specific subscription by ID
 * @route GET /api/subscriptions/:subscriptionId
 * @access Private
 */
export const getSubscriptionById = catchAsync(
  async (
    req: Request<{ subscriptionId: string }, {}, {}, {}>,
    res: Response
  ): Promise<void> => {
    const { subscriptionId } = sanitizeInput(req.params);

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      sendResponse(res, 404, false, "Subscription not found");
      return;
    }

    sendResponse(res, 200, true, "Subscription fetched successfully", {
      subscription,
    });
  }
);

/**
 * @desc Cancel all subscriptions for the user
 * @route DELETE /api/subscriptions/cancel-all
 * @access Private
 */
export const cancelAllSubscriptions = catchAsync(
  async (
    req: Request<{}, {}, {}, {}>,
    res: Response
  ): Promise<void> => {
    const userId: string = req.user?.id as string;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { subscriptions: [] } }, // Clear all subscriptions
      { new: true }
    );

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "All subscriptions canceled successfully", {
      subscriptions: user.subscriptions,
    });
  }
);
