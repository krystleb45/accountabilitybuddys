import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain, ValidationError } from "express-validator";
import logger from "../utils/winstonLogger";

/**
 * Middleware for handling request validation
 * @param {ValidationChain[]} validations - Array of validation chains to run before proceeding
 * @returns Middleware function to validate requests
 */
const validationMiddleware = (validations: ValidationChain[] = []) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Run all validations
      for (const validation of validations) {
        await validation.run(req);
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorDetails = errors.array().map((err: ValidationError) => ({
          field: "param" in err ? err.param : "unknown",
          message: err.msg,
        }));

        // Log validation errors
        logger.warn("Validation failed", { errors: errorDetails });

        // Send structured error response
        res.status(400).json({
          status: "fail",
          message: "Validation error",
          errors: errorDetails,
        });
        return;
      }

      next();
    } catch (error) {
      // Handle unexpected errors
      logger.error("Unexpected error during validation", { error });
      res.status(500).json({ message: "Internal server error during validation." });
    }
  };
};

export default validationMiddleware;
