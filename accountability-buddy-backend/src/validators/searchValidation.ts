import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for search queries
export const searchValidation = [
  // Validate search query parameter
  check("query")
    .not()
    .isEmpty()
    .withMessage("Search query is required.")
    .trim()
    .escape() // Sanitize to prevent XSS attacks
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters."),

  // Validate filters as an optional object
  check("filters")
    .optional()
    .isObject()
    .withMessage("Filters must be an object.")
    .custom((filters: Record<string, unknown>) => {
      // Check that all filter values are strings or numbers
      return Object.values(filters).every(
        (value) => typeof value === "string" || typeof value === "number"
      );
    })
    .withMessage("All filter values must be strings or numbers."),

  // Validate sort field
  check("sort")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort must be either \"asc\" or \"desc\"."),

  // Validate pagination parameters
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer greater than 0."),

  check("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100."),

  validate,
];

// Reusable validation middleware handler
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
          field: error.param,
          message: error.msg,
        })),
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
