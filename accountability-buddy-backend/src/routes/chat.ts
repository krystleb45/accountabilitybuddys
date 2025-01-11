import express, { Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import * as chatController from "../controllers/chatController";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import checkSubscription from "../middleware/checkSubscription";

const router: Router = express.Router();

// Rate limiter to prevent abuse in chat functionality
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: "Too many requests from this IP, please try again later.",
});

router.use(chatLimiter);

// Middleware for message validation
const validateMessage = [
  check("message")
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ max: 500 })
    .withMessage("Message content cannot exceed 500 characters"),
  check("groupId").optional().isMongoId().withMessage("Invalid group ID"),
];

// Custom validation handler
const handleValidationErrors = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

/**
 * Utility function for consistent error handling
 */
const handleRouteErrors = (
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
): ((req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: "Server error",
        error: (err as Error).message,
      });
    }
  };
};

/**
 * @route   POST /chat/send
 * @desc    Send a message in a group chat
 * @access  Private
 */
router.post(
  "/send",
  authMiddleware,
  [...validateMessage, handleValidationErrors],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.sendMessage(req, res, next);
  })
);

/**
 * @route   GET /chat/history/:groupId
 * @desc    Get chat history for a group
 * @access  Private
 */
router.get(
  "/history/:groupId",
  authMiddleware,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.getChatHistory(req, res, next);
  })
);

/**
 * @route   POST /chat/group
 * @desc    Create a new chat group
 * @access  Private
 */
router.post(
  "/group",
  authMiddleware,
  [
    check("name").notEmpty().withMessage("Group name is required"),
    check("members").isArray().withMessage("Members must be an array of user IDs"),
    handleValidationErrors,
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.createGroup(req, res, next);
  })
);

/**
 * @route   GET /chat/groups
 * @desc    Get all chat groups for the logged-in user
 * @access  Private
 */
router.get(
  "/groups",
  authMiddleware,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.getUserGroups(req, res, next);
  })
);

/**
 * @route   PUT /chat/group/:groupId/add
 * @desc    Add a user to a chat group
 * @access  Private
 */
router.put(
  "/group/:groupId/add",
  authMiddleware,
  [
    check("userId").isMongoId().withMessage("Invalid user ID"),
    handleValidationErrors,
  ],
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.addUserToGroup(req, res, next);
  })
);

/**
 * @route   DELETE /chat/group/:groupId/delete
 * @desc    Delete a chat group
 * @access  Private
 */
router.delete(
  "/group/:groupId/delete",
  authMiddleware,
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.getPrivateChats(req, res, next);
  })
);

/**
 * @route   GET /chat/private
 * @desc    Get private messages for the logged-in user
 * @access  Private (Standard and above subscriptions)
 */
router.get(
  "/private",
  authMiddleware,
  checkSubscription("standard"), // FIXED: Correctly validates subscription level
  handleRouteErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await chatController.getPrivateChats(req, res, next);
  })
);


export default router;
