import { Request, Response, NextFunction } from "express";
import { check, validationResult, ValidationChain } from "express-validator";
import bcrypt from "bcryptjs";

/**
 * Validation for registering a new user.
 */
export const registerUserValidation: ValidationChain[] = [
  check("username")
    .notEmpty()
    .withMessage("Username is required.")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and dashes.")
    .escape(), // Sanitize to prevent XSS

  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(), // Normalize email input

  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),

  validate,
];

/**
 * Validation for updating the user profile.
 */
export const updateUserProfileValidation: ValidationChain[] = [
  check("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and dashes.")
    .escape(), // Sanitize to prevent XSS

  check("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(), // Normalize email input

  check("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),

  validate,
];

/**
 * Validation for changing the user password.
 */
export const changePasswordValidation = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),

  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;
      const user = req.user; // Assume req.user is available (attached by auth middleware)

      // Validate if current password matches the user's password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }

      // Ensure new password is different from the current password
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from the current password.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Validation for deleting a user account.
 */
export const deleteUserAccountValidation: ValidationChain[] = [
  check("password")
    .notEmpty()
    .withMessage("Password is required to delete the account."),
  validate,
];

/**
 * Reusable validation middleware handler.
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
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
