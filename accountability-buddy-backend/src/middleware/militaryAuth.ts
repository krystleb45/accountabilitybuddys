import {Response, NextFunction } from "express-serve-static-core";
import MilitaryUser from "../models/MilitarySupport";
import { MilitaryRequest, IMilitaryUser } from "../types/CustomRequest";
import logger from "../utils/winstonLogger"; // Replace with your logger setup


const militaryAuth = async (
  req: MilitaryRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.id; // Assuming req.user.id is already validated in prior middleware

    // Check if user ID exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    // Fetch military user
    const militaryUser = await MilitaryUser.findOne({ userId });

    // Validate military membership
    if (!militaryUser || !militaryUser.isMilitary) {
      return res.status(403).json({ error: "Access restricted to military members." });
    }

    // Convert the Mongoose document into a plain object
    const plainMilitaryUser = militaryUser.toObject();

    // Explicitly enforce the type by first converting to 'unknown'
    req.militaryUser = plainMilitaryUser as unknown as IMilitaryUser;

    // Proceed to next middleware
    return next();
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Authorization Error: ${err.message}`); // Structured logging
    } else {
      logger.error("Authorization Error: Unknown error occurred");
    }
    return res.status(500).json({ error: "Authorization failed." });
  }
  
  
  
};

export default militaryAuth;
