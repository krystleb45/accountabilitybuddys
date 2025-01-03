import { Request, Response, NextFunction } from "express";
import { check, validationResult, ValidationChain } from "express-validator";

/**
 * Reusable MongoDB ID validation.
 * @param field - The field name to validate.
 * @returns An array of validation chains.
 */
const mongoIdRule = (field: string): ValidationChain[] => [
  check(field)
    .not()
    .isEmpty()
    .withMessage(`${field} is required`)
    .isMongoId()
    .withMessage(`Invalid ${field}`),
];

/**
 * Validation for creating an event.
 */
export const createEventValidation: ValidationChain[] = [
  check("title")
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be under 500 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  check("scheduledAt")
    .not()
    .isEmpty()
    .withMessage("Scheduled date and time are required")
    .isISO8601()
    .withMessage("Invalid date format (ISO 8601 required)"),
  check("participants")
    .optional()
    .isArray()
    .withMessage("Participants must be an array of user IDs")
    .notEmpty()
    .withMessage("Participants cannot be empty"),
  check("participants.*")
    .isMongoId()
    .withMessage("Invalid participant ID"),
  check("status")
    .optional()
    .isIn(["upcoming", "completed", "canceled"])
    .withMessage("Status must be one of: upcoming, completed, canceled"),
  validate,
];

/**
 * Validation for updating an event.
 */
export const updateEventValidation: ValidationChain[] = [
  ...mongoIdRule("eventId"), // Validate Event ID
  check("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be under 500 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  check("scheduledAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format (ISO 8601 required)"),
  check("participants")
    .optional()
    .isArray()
    .withMessage("Participants must be an array of user IDs"),
  check("participants.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid participant ID"),
  check("status")
    .optional()
    .isIn(["upcoming", "completed", "canceled"])
    .withMessage("Status must be one of: upcoming, completed, canceled"),
  validate,
];

/**
 * Validation for joining an event.
 */
export const joinEventValidation: ValidationChain[] = [
  ...mongoIdRule("eventId"), // Validate Event ID
  ...mongoIdRule("userId"), // Validate User ID
  validate,
];

/**
 * Middleware to handle validation results and send errors in a structured format.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
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
