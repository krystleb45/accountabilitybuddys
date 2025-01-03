import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import Newsletter from "../models/Newsletter";
import logger from "../utils/winstonLogger";

// Subscribe to the newsletter
export const signupNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required." });
      return;
    }

    const subscriber = await Newsletter.findOrCreate(email);

    if (subscriber.status === "unsubscribed") {
      subscriber.status = "subscribed";
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribeToken = crypto.randomBytes(16).toString("hex");
      await subscriber.save();
    }

    res.status(200).json({
      success: true,
      message: "You have successfully subscribed to the newsletter.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`Newsletter subscription error: ${errorMessage}`);
    next(error);
  }
};

// Unsubscribe from the newsletter
export const unsubscribeNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ success: false, message: "Invalid or missing token." });
      return;
    }

    const subscriber = await Newsletter.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      res.status(404).json({ success: false, message: "Subscriber not found." });
      return;
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribeToken = undefined;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "You have successfully unsubscribed from the newsletter.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`Newsletter unsubscription error: ${errorMessage}`);
    next(error);
  }
};

// Get all subscribers (Admin only)
export const getSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const subscribers = await Newsletter.find({ status: "subscribed" });

    if (!subscribers || subscribers.length === 0) {
      res.status(404).json({ success: false, message: "No subscribers found." });
      return;
    }

    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`Error fetching subscribers: ${errorMessage}`);
    next(error);
  }
};
