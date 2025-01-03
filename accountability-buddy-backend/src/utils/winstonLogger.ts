import { createLogger, format, transports } from "winston";
import path from "path";
import "winston-daily-rotate-file";

// Define log directory (e.g., using an environment variable or default path)
const logDir = process.env.LOG_DIR || "logs";

// Define log level from environment variable or default to 'info'
const logLevel = process.env.LOG_LEVEL || "info";

// Define custom log format
const customLogFormat = format.printf(
  ({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message} - ${stack}` // Log stack trace if present
      : `${timestamp} [${level}]: ${message}`;
  },
);

// Create a Winston logger instance
const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Standardized timestamp format
    format.errors({ stack: true }), // Capture stack trace for error logs
    customLogFormat,
  ),
  transports: [
    // Daily rotating file for error logs
    new transports.DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "5m", // Limit file size to 5MB
      maxFiles: "14d", // Retain logs for 14 days
      zippedArchive: true, // Compress rotated logs
    }),

    // Daily rotating file for combined logs
    new transports.DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "5m",
      maxFiles: "30d", // Retain logs for 30 days
      zippedArchive: true,
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize console logs
        format.simple(), // Simplified format for console output
      ),
    }),
  );
}

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new transports.File({ filename: path.join(logDir, "exceptions.log") }),
);

logger.rejections.handle(
  new transports.File({ filename: path.join(logDir, "rejections.log") }),
);

// Export the logger for use in other modules
export default logger;
