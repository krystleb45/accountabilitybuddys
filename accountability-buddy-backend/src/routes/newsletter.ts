import express, { Request, Response, NextFunction } from "express";
import { signupNewsletter } from "../controllers/NewsletterController"; // Corrected controller import path
import validateEmail from "../middleware/validationMiddleware"; // Corrected middleware import path
import rateLimit from "express-rate-limit";
import sanitize from "mongo-sanitize";
import logger from "../utils/winstonLogger"; // Corrected logger import path

const router = express.Router();

/**
 * Rate limiting to prevent abuse (e.g., bots signing up with many emails).
 */
const newsletterRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many signup attempts from this IP, please try again later.",
  },
});

/**
 * Middleware to handle errors in async routes.
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * @route   POST /newsletter/signup
 * @desc    Subscribe to the newsletter
 * @access  Public
 */
router.post(
  "/signup",
  newsletterRateLimiter,
  validateEmail,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sanitizedBody = sanitize(req.body);

    if (!sanitizedBody.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    try {
      await signupNewsletter(sanitizedBody.email);
      res.status(200).json({
        success: true,
        message: "Successfully subscribed to the newsletter.",
      });
    } catch (error) {
      logger.error("Newsletter signup error", {
        error,
        ip: req.ip,
        email: sanitizedBody.email,
      });
      res.status(500).json({
        success: false,
        message: "Failed to subscribe to the newsletter. Please try again later.",
      });
    }
  })
);

export default router;
