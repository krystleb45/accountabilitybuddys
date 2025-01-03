import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for creating a role
export const createRoleValidation = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Role name is required.")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Role name must be between 3 and 50 characters.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Role name must only contain letters and spaces.")
    .escape(), // Sanitize to prevent XSS

  check("permissions")
    .isArray({ min: 1 })
    .withMessage("Permissions must be an array with at least one permission.")
    .custom((permissions: unknown[]) =>
      permissions.every((permission) => typeof permission === "string")
    )
    .withMessage("Each permission must be a valid string."),

  validate,
];

// Validation for updating a role
export const updateRoleValidation = [
  check("roleId")
    .not()
    .isEmpty()
    .withMessage("Role ID is required.")
    .isMongoId()
    .withMessage("Role ID must be a valid Mongo ID"),

  check("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Role name must be between 3 and 50 characters.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Role name must only contain letters and spaces.")
    .escape(), // Sanitize to prevent XSS

  check("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array.")
    .custom((permissions: unknown[]) =>
      permissions.every((permission) => typeof permission === "string")
    )
    .withMessage("Each permission must be a valid string."),

  validate,
];

// Validation for assigning a role to a user
export const assignRoleValidation = [
  check("userId")
    .not()
    .isEmpty()
    .withMessage("User ID is required.")
    .isMongoId()
    .withMessage("User ID must be a valid Mongo ID"),

  check("roleId")
    .not()
    .isEmpty()
    .withMessage("Role ID is required.")
    .isMongoId()
    .withMessage("Role ID must be a valid Mongo ID"),

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
