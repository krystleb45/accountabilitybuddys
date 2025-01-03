import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

/**
 * Generates a common validation rule for Mongo ID fields.
 * @param field - The field name to validate.
 * @returns Array of validation rules.
 */
const mongoIdRule = (field: string): ReturnType<typeof check>[] => [
  check(field)
    .not()
    .isEmpty()
    .withMessage(`${field} is required`)
    .isMongoId()
    .withMessage(`Invalid ${field}`),
];

/**
 * Validation rules for sending a message.
 */
export const sendMessageValidation: ReturnType<typeof check>[] = [
  check("message")
    .not()
    .isEmpty()
    .withMessage("Message is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1 and 1000 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  ...mongoIdRule("groupId"), // Validate Group ID
  validate,
];

/**
 * Validation rules for creating a group.
 */
export const createGroupValidation: ReturnType<typeof check>[] = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Group name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Group name must be between 3 and 50 characters")
    .trim()
    .escape(), // Sanitize to prevent XSS
  check("members")
    .isArray()
    .withMessage("Group members must be an array")
    .notEmpty()
    .withMessage("Group must have at least one member"),
  check("members.*").isMongoId().withMessage("Invalid member ID"),
  validate,
];

/**
 * Validation rules for joining a group.
 */
export const joinGroupValidation: ReturnType<typeof check>[] = [
  ...mongoIdRule("groupId"), // Validate Group ID
  ...mongoIdRule("userId"), // Validate User ID
  validate,
];

/**
 * Middleware to handle validation results and send errors in a structured format.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
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
