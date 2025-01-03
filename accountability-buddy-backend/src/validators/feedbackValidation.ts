import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for submitting feedback
export const submitFeedbackValidation = [
  check("message")
    .not()
    .isEmpty()
    .withMessage("Feedback message is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Feedback message must be between 10 and 1000 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  check("type")
    .optional()
    .isIn(["bug", "feature-request", "other"])
    .withMessage(
      "Invalid feedback type. Must be one of: bug, feature-request, or other."
    ),
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
