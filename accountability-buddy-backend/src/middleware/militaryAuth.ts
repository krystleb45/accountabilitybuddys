import {Response, NextFunction } from "express";
import MilitaryUser from "../models/MilitarySupport";
import logger from "../utils/winstonLogger"; // Logger setup
import { MilitaryRequest, IMilitaryUser } from "../types/CustomRequest"; // Import the required types

/**
 * Middleware for verifying military user authentication and access.
 */
const militaryAuth = async (
  req: MilitaryRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Extract user ID from request object (validated earlier by other middleware)
    const userId = req.user?.id;

    // Check if user ID exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    // Fetch military user based on ID
    const militaryUser = await MilitaryUser.findOne({ userId });

    // Validate military membership status
    if (!militaryUser || !militaryUser.isMilitary) {
      return res
        .status(403)
        .json({ error: "Access restricted to military members." });
    }

    // Fix: Convert to unknown first, then assert explicitly to IMilitaryUser
    req.militaryUser = militaryUser.toObject() as unknown as IMilitaryUser;

    // Proceed to the next middleware or route handler
    return next();
  } catch (err) {
    // Log errors for debugging purposes
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    logger.error(`Military Authorization Error: ${errorMessage}`);

    return res
      .status(500)
      .json({ error: "Authorization failed. Please try again later." });
  }
};

export default militaryAuth;
