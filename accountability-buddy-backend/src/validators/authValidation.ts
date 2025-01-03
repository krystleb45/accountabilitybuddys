import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Common password validation rule for reuse
const passwordRule = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

// Validation rules for user registration
export const registerValidation = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and dashes"
    ),
  check("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(), // Normalizes email input
  ...passwordRule,
  validate,
];

// Validation rules for user login
export const loginValidation = [
  check("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required"),
  validate,
];

// Validation rules for password reset request
export const forgotPasswordValidation = [
  check("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  validate,
];

// Validation rules for resetting the password
export const resetPasswordValidation = [...passwordRule, validate];

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
