import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import sanitize from "mongo-sanitize";
import User from "../models/User";
import logger from "../utils/winstonLogger";

// Define and export AuthenticatedRequest directly
export interface AuthenticatedRequest extends Request {
  user?: { // Make user optional
    id: string;
    email?: string; // Make email optional
    role: "user" | "admin" | "moderator";
    isAdmin?: boolean;
  };
}

/**
 * Authentication Middleware
 * Validates JWT and attaches user details to the request object.
 */
const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Retrieve Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and follows Bearer format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authorization header missing or malformed");
      res.status(401).json({
        success: false,
        message: "Authorization denied. No valid token provided.",
      });
      return; // Exit early
    }

    // Extract and sanitize the token
    const token = sanitize(authHeader.split(" ")[1]);
    if (!token) {
      logger.warn("Token extraction failed from authorization header");
      res.status(401).json({
        success: false,
        message: "Authorization denied. Invalid token.",
      });
      return; // Exit early
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as {
      id: string;
      role: "user" | "admin" | "moderator";
    };

    // Validate decoded token structure
    if (!decoded?.id || !decoded?.role) {
      logger.warn("Token verification failed: missing required fields");
      res.status(401).json({
        success: false,
        message: "Authorization denied. Invalid token payload.",
      });
      return; // Exit early
    }

    // Find the user in the database
    const user = await User.findById(decoded.id).select("id email role");
    if (!user) {
      logger.warn("User not found for provided token");
      res.status(401).json({
        success: false,
        message: "Authorization denied. User does not exist.",
      });
      return; // Exit early
    }

    // Attach user details to the request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin",
    };

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`JWT error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: "Authorization denied. Invalid token.",
      });
      return; // Exit early
    }

    // Handle general errors
    logger.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export default authMiddleware;
