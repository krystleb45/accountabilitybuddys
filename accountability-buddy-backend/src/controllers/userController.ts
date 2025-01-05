import { Request, Response } from "express";
import Subscription from "../models/Subscription";
import stripe from "../utils/stripe"; // Ensure this is how you import/initialize Stripe
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";
import sanitizeInput from "../utils/sanitizeInput"; // Fixed import syntax
import { mapStripeStatusToCustomStatus } from "../utils/mapStripeStatus"; // Ensure this exists

// Extend Express.Request if not already done in a global type declaration file
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin?: boolean;
      };
    }
  }
}

// Upgrade Subscription
export const upgradeSubscription = catchAsync(
  async (
    req: Request<{}, {}, { planId: string }>, // Explicit request type with generics
    res: Response
  ): Promise<void> => {
    const userId: string = req.user?.id || ""; // Ensures a fallback for userId
    const { planId } = sanitizeInput(req.body) as { planId: string }; // Sanitize input

    // Validate input
    if (!userId || !planId) {
      sendResponse(res, 400, false, "User ID and Plan ID are required");
      return;
    }

    const allowedPlans = ["free-trial", "basic", "standard", "premium"] as const;
    if (!allowedPlans.includes(planId as typeof allowedPlans[number])) {
      sendResponse(res, 400, false, "Invalid plan ID provided");
      return;
    }

    // Fetch user subscription
    const userSubscription = await Subscription.findOne({ user: userId });
    if (!userSubscription) {
      sendResponse(res, 404, false, "Subscription not found");
      return;
    }

    try {
      // Update subscription in Stripe
      const updatedSubscription = await stripe.subscriptions.update(
        userSubscription.id,
        { items: [{ price: planId }] }
      );

      // Map status to a custom format
      const allowedStatuses = [
        "trial", "active", "inactive", "expired", 
        "past_due", "canceled", "incomplete", 
        "incomplete_expired", "unpaid"
      ] as const;

      const mappedStatus = mapStripeStatusToCustomStatus(updatedSubscription.status);
      if (!allowedStatuses.includes(mappedStatus as typeof allowedStatuses[number])) {
        throw new Error("Invalid status from Stripe");
      }

      // Update subscription details
      userSubscription.status = mappedStatus as typeof allowedStatuses[number]; // Fixed type assignment
      userSubscription.plan = planId as "free-trial" | "basic" | "standard" | "premium"; // Fixed type assignment
      await userSubscription.save();

      // Send success response
      sendResponse(res, 200, true, "Subscription upgraded successfully", {
        subscription: userSubscription,
      });
    } catch (error) {
      logger.error(`Stripe subscription upgrade failed: ${(error as Error).message}`);
      sendResponse(res, 500, false, "Failed to upgrade subscription");
    }
  }
);
