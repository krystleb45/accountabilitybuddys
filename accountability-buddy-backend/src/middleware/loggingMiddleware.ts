import { Request, Response, NextFunction } from "express-serve-static-core";
import logger from "../utils/winstonLogger";

/**
 * Middleware for logging all incoming requests with additional context.
 * Logs request details at the start and response details upon completion.
 */
const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, url, headers, body } = req;

  // Log incoming request
  try {
    logger.info(`[REQUEST] ${method} ${url}`, {
      headers,
      body: Object.keys(body).length ? body : undefined, // Log body only if present
      ip: req.ip,
    });
  } catch (error) {
    logger.error(`[LOGGING] Failed to log request: ${error.message}`);
  }

  // Log response details on finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    try {
      logger.info(`[RESPONSE] ${method} ${url}`, {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        duration: `${duration}ms`,
        ip: req.ip,
      });
    } catch (error) {
      logger.error(`[LOGGING] Failed to log response: ${error.message}`);
    }
  });

  next();
};

export default loggingMiddleware;
