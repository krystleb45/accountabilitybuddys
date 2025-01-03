import { Request, Response, NextFunction } from "express-serve-static-core";
import logger from "../utils/winstonLogger";

// Define the extended error interface
interface CustomError extends Error {
  statusCode: number; // HTTP status code
  isOperational: boolean; // True for predictable, operational errors
  details?: unknown; // Additional details about the error
}

// Utility to create custom errors
export const createError = (
  message: string,
  statusCode: number = 500,
  isOperational: boolean = true,
  details: unknown = null,
): CustomError => {
  const error: CustomError = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  error.details = details;
  return error;
};

// Middleware to handle errors
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction, // Renamed 'next' to '_next' to comply with ESLint rules
): void => {
  // Log the error
  logger.error(
    `Error: ${err.message}, Status: ${err.statusCode || 500}, Details: ${
      err.details || "N/A"
    }`,
  );

  // Prepare the response
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.isOperational ? err.message : "An unexpected error occurred.",
    ...(err.isOperational && err.details ? { details: err.details } : {}),
  };

  res.status(statusCode).json(response);
};
