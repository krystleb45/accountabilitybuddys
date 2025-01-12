import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

/**
 * Middleware to handle validation results and send errors in a structured format.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export const chatValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => {
      if ("param" in error) {
        return {
          field: error.param,
          message: error.msg,
        };
      }
      return {
        field: "unknown",
        message: error.msg,
      };
    });

    res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
    return;
  }

  next();
};

/**
 * Generates a common validation rule for Mongo ID fields.
 * @param field - The field name to validate.
 * @returns Array of validation rules.
 */
const mongoIdRule = (field: string) => [
  check(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isMongoId()
    .withMessage(`Invalid ${field}`),
];

/**
 * Validation rules for sending a message.
 */
export const sendMessageValidation = [
  check("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1 and 1000 characters")
    .trim()
    .escape(),
  ...mongoIdRule("groupId"),
  chatValidationMiddleware,
];

/**
 * Validation rules for creating a group.
 */
export const createGroupValidation = [
  check("name")
    .notEmpty()
    .withMessage("Group name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Group name must be between 3 and 50 characters")
    .trim()
    .escape(),
  check("members")
    .isArray()
    .withMessage("Group members must be an array")
    .notEmpty()
    .withMessage("Group must have at least one member"),
  check("members.*").isMongoId().withMessage("Invalid member ID"),
  chatValidationMiddleware,
];

/**
 * Validation rules for joining a group.
 */
export const joinGroupValidation = [
  ...mongoIdRule("groupId"),
  ...mongoIdRule("userId"),
  chatValidationMiddleware,
];
