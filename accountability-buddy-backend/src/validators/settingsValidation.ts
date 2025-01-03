import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

// Validation for updating user or application settings
export const updateSettingsValidation = [
  // Validate notification preference
  check("notifications")
    .optional()
    .isBoolean()
    .withMessage("Notifications setting must be true or false."),

  // Validate language setting
  check("language")
    .optional()
    .isIn(["en", "es", "de", "fr", "jp"])
    .withMessage("Language must be one of: en, es, de, fr, jp."),

  // Validate privacy settings
  check("privacy")
    .optional()
    .isObject()
    .withMessage("Privacy settings must be an object.")
    .custom((privacy: Record<string, unknown>) => {
      // Validate individual privacy settings
      const validKeys = ["profileVisibility", "showActivity", "shareData"];
      return Object.keys(privacy).every((key) => validKeys.includes(key));
    })
    .withMessage("Privacy settings contain invalid keys."),

  // Validate theme setting
  check("theme")
    .optional()
    .isIn(["light", "dark"])
    .withMessage("Theme must be either \"light\" or \"dark\"."),

  // Validate email preferences
  check("emailPreferences")
    .optional()
    .isObject()
    .withMessage("Email preferences must be an object.")
    .custom((prefs: Record<string, boolean>) => {
      // Validate keys and boolean values within email preferences
      const validPrefs = ["marketingEmails", "transactionalEmails", "updateEmails"];
      return Object.keys(prefs).every(
        (key) => validPrefs.includes(key) && typeof prefs[key] === "boolean"
      );
    })
    .withMessage("Email preferences must contain valid keys with boolean values."),

  // Validate timezone setting
  check("timezone")
    .optional()
    .isString()
    .withMessage("Timezone must be a string.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Timezone must be between 1 and 50 characters.")
    .trim()
    .escape(), // Sanitize to prevent XSS

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
