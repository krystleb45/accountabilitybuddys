import { Request, Response, NextFunction } from "express"; // Fixed import
import jwt from "jsonwebtoken";
import sanitize from "mongo-sanitize";
import User from "../models/User";
import logger from "../utils/winstonLogger";

// Extend Request for authenticated users
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string; // Added email field to match global type
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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authorization header missing or malformed");
      res.status(401).json({
        success: false,
        message: "Authorization denied. No valid token provided.",
      });
      return; // <-- Exit function after response
    }

    const token = sanitize(authHeader.split(" ")[1]);
    if (!token) {
      logger.warn("Token extraction failed from authorization header");
      res.status(401).json({
        success: false,
        message: "Authorization denied. Invalid token.",
      });
      return; // <-- Exit function after response
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
      id: string;
      role: "user" | "admin" | "moderator";
    };

    if (!decoded?.id || !decoded?.role) {
      logger.warn("Token verification failed: missing required fields");
      res.status(401).json({
        success: false,
        message: "Authorization denied. Invalid token payload.",
      });
      return; // <-- Exit function after response
    }

    const user = await User.findById(decoded.id).select("id email role");
    if (!user) {
      logger.warn("User not found for provided token");
      res.status(401).json({
        success: false,
        message: "Authorization denied. User does not exist.",
      });
      return; // <-- Exit function after response
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin",
    };

    // Move to the next middleware
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`JWT error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: "Authorization denied. Invalid token.",
      });
      return; // <-- Exit function after response
    }

    logger.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
    return; // <-- Exit function after response
  }
};


export default authMiddleware;
