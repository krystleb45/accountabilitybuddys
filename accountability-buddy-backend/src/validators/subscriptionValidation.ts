import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for creating a subscription session
export const createSubscriptionValidation = [
  check("planId")
    .notEmpty()
    .withMessage("Plan ID is required.")
    .trim()
    .isString()
    .withMessage("Plan ID must be a valid string."),

  check("userId")
    .optional() // Optional since it can be derived from the auth token
    .trim()
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId."),

  validate,
];

// Validation for canceling a subscription
export const cancelSubscriptionValidation = [
  check("subscriptionId")
    .notEmpty()
    .withMessage("Subscription ID is required.")
    .trim()
    .isString()
    .withMessage("Subscription ID must be a valid string."),

  validate,
];

// Validation for checking subscription status
export const checkSubscriptionStatusValidation = [
  check("userId")
    .optional() // Typically derived from the token, but can be passed
    .trim()
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId."),

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
