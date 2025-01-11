import express, { Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import APIKey from "../models/APIKey";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl";
import logger from "../utils/winstonLogger";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

const router: Router = express.Router();

// Middleware to ensure only admins can manage API keys
const isAdmin = roleBasedAccessControl(["admin"]);

// Rate limiter for POST requests
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests. Please try again later.",
});

/**
 * Utility function to handle route errors
 */
const handleRouteErrors = (
  handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error occurred: ${(error as Error).message}`);
      next(error);
    }
  };
};

/**
 * @route   GET /api/api-keys
 * @desc    Get all API keys (Admin only)
 * @access  Private (Admin access)
 */
router.get(
  "/",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Example usage of req to avoid linting errors
    logger.info(`Fetching API keys requested by user: ${req.user?.id}`);

    const apiKeys = await APIKey.find().select("-secret"); // Exclude the secret for security
    res.json({ success: true, data: apiKeys });
  })
);


/**
 * @route   POST /api/api-keys
 * @desc    Create a new API key (Admin only)
 * @access  Private (Admin access)
 */
router.post(
  "/",
  rateLimiter,
  authMiddleware,
  isAdmin,
  [
    check("permissions", "Permissions must be an array").isArray(), // Validation for permissions
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Extract and sanitize the request body
    const { permissions } = sanitize(req.body);

    // Convert the user ID to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user?.id); // FIXED: Convert string to ObjectId

    // Generate the API key
    const apiKey = await APIKey.generateKeyForUser(
      userId, // Pass the ObjectId instead of string
      permissions // Pass permissions
    );

    // Log and return the response
    logger.info(`API key created by admin: ${req.user?.id}, Key: ${apiKey.key}`);
    res.json({ success: true, data: apiKey });
  })
);


/**
 * @route   DELETE /api/api-keys/:id
 * @desc    Delete an API key by ID (Admin only)
 * @access  Private (Admin access)
 */
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const apiKey = await APIKey.findById(req.params.id);

    if (!apiKey) {
      logger.warn(`API key not found for ID: ${req.params.id}`);
      res.status(404).json({ success: false, message: "API key not found" });
      return;
    }

    await APIKey.deleteOne({ _id: req.params.id });
    logger.info(`API key deleted by admin: ${req.user?.id}, Key ID: ${req.params.id}`);
    res.json({ success: true, message: "API key deleted successfully" });
  })
);

/**
 * @route   PUT /api/api-keys/:id/activate
 * @desc    Activate an API key by ID (Admin only)
 * @access  Private (Admin access)
 */
router.put(
  "/:id/activate",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const apiKey = await APIKey.findById(req.params.id);

    if (!apiKey) {
      logger.warn(`API key not found for activation. ID: ${req.params.id}`);
      res.status(404).json({ success: false, message: "API key not found" });
      return;
    }

    apiKey.isActive = true;
    await apiKey.save();

    logger.info(`API key activated by admin: ${req.user?.id}, Key ID: ${req.params.id}`);
    res.json({ success: true, message: "API key activated successfully" });
  })
);

/**
 * @route   PUT /api/api-keys/:id/deactivate
 * @desc    Deactivate an API key by ID (Admin only)
 * @access  Private (Admin access)
 */
router.put(
  "/:id/deactivate",
  authMiddleware,
  isAdmin,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const apiKey = await APIKey.findById(req.params.id);

    if (!apiKey) {
      logger.warn(`API key not found for deactivation. ID: ${req.params.id}`);
      res.status(404).json({ success: false, message: "API key not found" });
      return;
    }

    apiKey.isActive = false;
    await apiKey.save();

    logger.info(`API key deactivated by admin: ${req.user?.id}, Key ID: ${req.params.id}`);
    res.json({ success: true, message: "API key deactivated successfully" });
  })
);

export default router;
