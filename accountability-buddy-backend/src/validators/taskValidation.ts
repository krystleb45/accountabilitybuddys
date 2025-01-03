import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for creating a task
export const createTaskValidation = [
  check("title")
    .notEmpty()
    .withMessage("Task title is required.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Task title must be between 3 and 100 characters.")
    .escape(), // Sanitize to prevent XSS

  check("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot be more than 500 characters.")
    .escape(), // Sanitize to prevent XSS

  check("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date.")
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Due date must be in the future.");
      }
      return true;
    }),

  check("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high."),

  check("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed."),

  validate,
];

// Validation for updating a task
export const updateTaskValidation = [
  check("taskId")
    .notEmpty()
    .withMessage("Task ID is required.")
    .isMongoId()
    .withMessage("Task ID must be a valid Mongo ID"),

  check("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Task title must be between 3 and 100 characters.")
    .escape(), // Sanitize to prevent XSS

  check("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot be more than 500 characters.")
    .escape(), // Sanitize to prevent XSS

  check("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date.")
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Due date must be in the future.");
      }
      return true;
    }),

  check("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high."),

  check("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed."),

  validate,
];

// Validation for deleting a task
export const deleteTaskValidation = [
  check("taskId")
    .notEmpty()
    .withMessage("Task ID is required.")
    .isMongoId()
    .withMessage("Task ID must be a valid Mongo ID"),

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
