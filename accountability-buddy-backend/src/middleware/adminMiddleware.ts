import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import sanitize from "mongo-sanitize";
import User from "../models/User";
import logger from "../utils/winstonLogger";

const adminMiddleware = async (
  req: Request, // Ensure this matches Express.Request
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Authorization header missing or malformed");
      res.status(401).json({ message: "Authorization denied, no valid token provided." });
      return;
    }

    const token = sanitize(authHeader.split(" ")[1]);
    if (!token) {
      logger.warn("Token extraction failed from authorization header");
      res.status(401).json({ message: "Authorization denied, invalid token." });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as { id: string; role: "user" | "admin" | "moderator" };

    if (!decoded || !decoded.id || !decoded.role) {
      logger.warn("Token verification failed");
      res.status(401).json({ message: "Authorization denied, invalid token payload." });
      return;
    }

    const user = await User.findById(decoded.id).select("id role");
    if (!user) {
      logger.warn("User not found for provided token");
      res.status(401).json({ message: "Authorization denied, user does not exist." });
      return;
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      logger.warn(`User ${user.id} attempted to access an admin route.`);
      res.status(403).json({ message: "Access denied. Admin privileges required." });
      return;
    }

    // Attach user details to the request
    req.user = {
      id: user.id,
      email: user.email || "",
      role: user.role as "user" | "admin" | "moderator",
      isAdmin: user.role === "admin",
    } as { id: string; email: string; role: "user" | "admin" | "moderator"; isAdmin: boolean };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`JWT error: ${error.message}`);
      res.status(401).json({ message: "Authorization denied, invalid token." });
      return;
    }

    logger.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error during authentication." });
  }
};

export default adminMiddleware;
