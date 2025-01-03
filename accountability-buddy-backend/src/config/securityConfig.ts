import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xssClean from "xss-clean";
import cors, { CorsOptionsDelegate } from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import logger from "../utils/winstonLogger";

// Parse Allowed Origins
const parseAllowedOrigins = (): string[] => {
  const origins = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
  return origins.split(",").map((origin) => origin.trim());
};

// CORS Configuration
const configureCORS = (): CorsOptionsDelegate => {
  const allowedOrigins = parseAllowedOrigins();

  logger.info(`Allowed Origins: ${allowedOrigins.join(", ")}`);

  return (origin, callback) => {
    if (!origin || (typeof origin === "string" && allowedOrigins.includes(origin))) {
      callback(null, true as any);
    } else {
      const errorMessage = `Origin ${origin} is not allowed by CORS policy`;
      logger.warn(errorMessage);
      callback(new Error(errorMessage));
    }
  };
};

// Rate Limiting Configuration
const configureRateLimiter = (): ReturnType<typeof rateLimit> => {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);

  logger.info(`Rate Limit Max: ${maxRequests}`);

  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: maxRequests,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        error: "Too many requests, please try again later.",
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Helmet Configuration
const configureHelmet = (): ReturnType<typeof helmet> => {
  const isProduction = process.env.NODE_ENV === "production";
  return helmet({
    contentSecurityPolicy: isProduction
      ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "trusted-scripts.com"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "trusted-images.com"],
        },
      }
      : undefined,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
};

// XSS Protection
const configureXSSProtection = (): ReturnType<typeof xssClean> => xssClean();

// Security Middleware Aggregator
export const applySecurityMiddlewares = (app: Application): void => {
  app.use(configureHelmet());
  app.use(cors(configureCORS()));
  app.use(configureRateLimiter());
  app.use(configureXSSProtection());

  // Additional middleware
  const payloadLimit = process.env.PAYLOAD_LIMIT || "10kb";
  app.use(express.json({ limit: payloadLimit }));
  app.use(express.urlencoded({ extended: true, limit: payloadLimit }));

  // Middleware to handle security-related errors
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`Security middleware error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  });

  logger.info("Security middlewares applied.");
};
