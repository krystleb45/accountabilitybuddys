import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import sessionController from "../controllers/SessionController"; // Corrected controller import path
import logger from "../utils/winstonLogger"; // Logger utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of session-related actions.
 */
const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 session-related requests per window
  message: "Too many session requests from this IP, please try again later.",
});

/**
 * Middleware to sanitize user input.
 */
const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    req.body = sanitize(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to handle validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @route   POST /session/login
 * @desc    Log in a user and create a session
 * @access  Public
 */
router.post(
  "/login",
  sessionLimiter,
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  sanitizeInput,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      await sessionController.login(email, password, req, res);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      logger.error(`Error during login: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   POST /session/logout
 * @desc    Log out the user and end the session
 * @access  Private
 */
router.post(
  "/logout",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await sessionController.logout(req, res);
      res.json({ success: true, msg: "Logged out successfully" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      logger.error(`Error during logout: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   POST /session/refresh
 * @desc    Refresh the session to extend its expiration
 * @access  Private
 */
router.post(
  "/refresh",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await sessionController.refreshSession(req, res);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      logger.error(`Error refreshing session: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   GET /session
 * @desc    Get current user's active sessions
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await sessionController.getUserSessions(req.user.id);
      res.status(200).json({ success: true, sessions });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      logger.error(`Error fetching user sessions: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   DELETE /session/:sessionId
 * @desc    Delete a specific session by session ID
 * @access  Private
 */
router.delete(
  "/:sessionId",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    try {
      await sessionController.deleteSession(sessionId, req.user.id);
      res.json({ success: true, msg: "Session ended successfully" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      logger.error(`Error ending session: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

/**
 * @route   DELETE /session/all
 * @desc    Delete all user sessions except the current one
 * @access  Private
 */
router.delete(
  "/all",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await sessionController.deleteAllSessions(req.user.id, req.session.id);
      res.json({ success: true, msg: "All other sessions ended successfully" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
      logger.error(`Error ending all sessions: ${errorMessage}`);
      res.status(500).json({ success: false, msg: "Server error", error: errorMessage });
    }
  }
);

export default router;
