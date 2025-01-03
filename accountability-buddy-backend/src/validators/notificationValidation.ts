import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for sending a notification
export const sendNotificationValidation = [
  check("type")
    .not()
    .isEmpty()
    .withMessage("Notification type is required.")
    .trim()
    .isIn(["email", "sms", "app"])
    .withMessage("Notification type must be either email, sms, or app."),

  // Conditional validation for 'to' field based on notification type
  check("to")
    .if(check("type").equals("email"))
    .not()
    .isEmpty()
    .withMessage("Recipient email is required for email notifications.")
    .trim()
    .isEmail()
    .withMessage("A valid email is required for email notifications.")
    .normalizeEmail(), // Normalize email input

  check("to")
    .if(check("type").equals("sms"))
    .not()
    .isEmpty()
    .withMessage("Recipient phone number is required for SMS notifications.")
    .trim()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage("A valid phone number is required for SMS notifications."),

  // Validation for subject if the notification type is email
  check("subject")
    .if(check("type").equals("email"))
    .not()
    .isEmpty()
    .withMessage("Subject is required for email notifications.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Subject must be between 3 and 100 characters.")
    .escape(), // Sanitize to prevent XSS

  // Message validation for all notification types
  check("message")
    .not()
    .isEmpty()
    .withMessage("Message is required.")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters.")
    .escape(), // Sanitize to prevent XSS

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
