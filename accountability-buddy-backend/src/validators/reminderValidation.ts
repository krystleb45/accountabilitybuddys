import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for creating or updating a reminder
export const validateReminder = [
  // Validate goal ID to ensure it's a valid MongoDB ObjectId
  check("goalId")
    .not()
    .isEmpty()
    .withMessage("Goal ID is required.")
    .isMongoId()
    .withMessage("Goal ID must be a valid Mongo ID"),

  // Validate message to ensure it's not empty and has a reasonable length
  check("message")
    .not()
    .isEmpty()
    .withMessage("Message is required.")
    .trim()
    .escape() // Sanitize input to prevent XSS attacks
    .isLength({ min: 5, max: 500 })
    .withMessage("Message must be between 5 and 500 characters"),

  // Validate that the reminder date is a valid ISO 8601 date and in the future
  check("remindAt")
    .not()
    .isEmpty()
    .withMessage("Reminder date is required.")
    .isISO8601()
    .withMessage("Reminder date must be a valid ISO 8601 date")
    .toDate()
    .custom((value: Date) => {
      if (value <= new Date()) {
        throw new Error("Reminder date must be in the future");
      }
      return true;
    }),

  validate,
];

// Reusable validation middleware handler
export const validate = (req: Request, res: Response, next: NextFunction): void => {
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
