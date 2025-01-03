import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

// Validation for creating a group
export const createGroupValidation = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Group name is required.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Group name must be between 3 and 50 characters.")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Group name must only contain letters, numbers, and spaces."),

  check("description")
    .optional()
    .trim()
    .escape() // Sanitize to prevent XSS
    .isLength({ max: 300 })
    .withMessage("Description cannot be more than 300 characters."),

  check("interests")
    .isArray({ min: 1 })
    .withMessage("You must select at least one interest.")
    .custom((interests: string[]) => interests.every((interest) => typeof interest === "string"))
    .withMessage("Interests must be an array of strings."),

  validate,
];

// Validation for joining a group
export const joinGroupValidation = [
  check("groupId")
    .not()
    .isEmpty()
    .withMessage("Group ID is required.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid group ID."),

  check("userId")
    .not()
    .isEmpty()
    .withMessage("User ID is required.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user ID."),

  validate,
];

// Reusable validation middleware handler
export const validate = (req: Request, res: Response, next: NextFunction): void => {
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
