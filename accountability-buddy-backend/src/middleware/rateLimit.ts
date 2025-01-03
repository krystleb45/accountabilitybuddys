import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger";
import { Request, Response} from "express-serve-static-core";

// Load IP whitelist from environment variables or fallback to defaults
const trustedIps: string[] = (
  process.env.TRUSTED_IPS || "127.0.0.1,192.168.1.1"
).split(",");

/**
 * Rate limiter middleware for API requests.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10), // Max requests per window, default to 100
  standardHeaders: true, // Include RateLimit headers in responses
  legacyHeaders: false, // Disable X-RateLimit headers

  // Skip rate limiting for whitelisted IPs
  skip: (req: Request) => trustedIps.includes(req.ip ?? ""), // Use empty string if req.ip is undefined

  // Use user ID for rate limiting if authenticated, otherwise use IP
  keyGenerator: (req: Request) =>
    req.user ? req.user.id : (req.ip ?? "unknown"),

  // Custom error response
  handler: (req: Request, res: Response) => {
    const userId = req.user ? req.user.id : "Guest";

    // Log when the rate limit is exceeded
    logger.warn({
      message: "Rate limit reached",
      userId,
      ip: req.ip ?? "unknown",
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
    });

    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
      retryAfter: Math.ceil(15 * 60), // Retry after 15 minutes (in seconds)
    });
  },
});

export default limiter;
