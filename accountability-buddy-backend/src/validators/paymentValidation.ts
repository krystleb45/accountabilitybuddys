import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for creating a payment session
export const createPaymentSessionValidation = [
  check("planId")
    .not()
    .isEmpty()
    .withMessage("Plan ID is required.")
    .trim()
    .isString()
    .withMessage("Plan ID must be a valid string"),

  check("userId")
    .optional() // Validate only if provided, as user ID may be derived from the token
    .trim()
    .isMongoId()
    .withMessage("A valid user ID is required"),

  validate,
];

// Validation for handling webhook events from Stripe
export const webhookValidation = [
  check("eventType")
    .not()
    .isEmpty()
    .withMessage("Event type is required.")
    .trim()
    .isString()
    .withMessage("Event type must be a valid string"),

  check("eventData")
    .not()
    .isEmpty()
    .withMessage("Event data is required.")
    .isObject()
    .withMessage("Event data must be a valid object"),

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
