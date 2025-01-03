import rateLimit, { Options, RateLimitRequestHandler } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redisClient"; // Ensure this points to your Redis client configuration
import { Request, Response } from "express";
import logger from "./winstonLogger"; // Replace with your logger utility

// Define types for Redis arguments
type RedisCommandArgument = string | Buffer;
type RedisCommandArguments = Array<RedisCommandArgument>;

/**
 * @desc    Creates a rate limiter with configurable limits, IP-based throttling, and optional Redis-backed storage.
 * @param   {number} maxRequests - Maximum number of requests allowed during the window.
 * @param   {number} windowMs - Window size in milliseconds during which requests are counted.
 * @param   {string} [message] - Custom message to send when the rate limit is exceeded.
 * @param   {boolean} [useRedis=false] - Whether to use Redis for distributed rate-limiting across multiple servers.
 * @returns {RateLimitRequestHandler} Middleware function to apply rate limiting.
 */
const createRateLimiter = (
  maxRequests: number,
  windowMs: number,
  message: string = "Too many requests, please try again later.",
  useRedis: boolean = false,
): RateLimitRequestHandler => {
  const options: Partial<Options> = {
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      message,
    },
    headers: true, // Include rate limit info in response headers
    skipFailedRequests: false, // Count failed requests to prevent abuse
    keyGenerator: (req: Request): string => req.ip || "unknown-client", // Ensure keyGenerator always returns a string
    handler: (req: Request, res: Response) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
      });
      res.status(429).json({
        success: false,
        message,
      });
    },
    standardHeaders: true, // Include `RateLimit-*` headers in responses
    legacyHeaders: false, // Disable deprecated `X-RateLimit-*` headers
  };

  // If Redis is enabled, configure RedisStore
  if (useRedis) {
    options.store = new RedisStore({
      sendCommand: async (command: string, args: RedisCommandArguments): Promise<string | null> => {
        try {
          const response = await redisClient.sendCommand([command, ...args]);
          logger.debug("Redis command executed", { command, args, response });
          return response ? response.toString() : null;
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          logger.error("Error in sendCommand", { command, args, error: errorMessage });
          throw error;
        }
      },
    });
  }

  return rateLimit(options);
};

/**
 * @desc    Global rate limiter across all routes.
 *          100 requests per 15 minutes.
 */
export const globalRateLimiter = createRateLimiter(100, 15 * 60 * 1000, undefined, true);

/**
 * @desc    Rate limiter for authentication routes (e.g., login, register).
 *          5 requests per 15 minutes.
 */
export const authRateLimiter = createRateLimiter(
  5,
  15 * 60 * 1000,
  "Too many login attempts, please try again later.",
  true,
);

/**
 * @desc    Rate limiter for sensitive data routes (e.g., password reset).
 *          10 requests per 30 minutes.
 */
export const sensitiveDataRateLimiter = createRateLimiter(
  10,
  30 * 60 * 1000,
  "Too many attempts, please try again in 30 minutes.",
  true,
);

/**
 * @desc    Custom rate limiter for specific routes or actions.
 * @param   {number} maxRequests - Maximum number of requests allowed.
 * @param   {number} windowMs - Window size in milliseconds.
 * @param   {string} [message] - Custom message for rate limit violations.
 * @param   {boolean} [useRedis=false] - Whether to use Redis for distributed rate limiting.
 * @returns {RateLimitRequestHandler} Middleware function to apply custom rate limiting.
 */
export const customRateLimiter = (
  maxRequests: number,
  windowMs: number,
  message: string,
  useRedis: boolean = false,
): RateLimitRequestHandler => {
  return createRateLimiter(maxRequests, windowMs, message, useRedis);
};
