import { Request, Response, NextFunction } from "express";
import { check, validationResult, ValidationChain } from "express-validator";
import multer, { MulterError } from "multer";

// Allowed file types for upload
const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

/**
 * Multer setup for file uploads with file size limit and file type checking.
 */
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB file size limit
  },
  fileFilter: (req, file, cb): void => {
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
    }
    cb(null, true);
  },
}).single("file");

/**
 * File upload validation middleware.
 * Handles both multer validation and express-validator checks.
 */
export const fileUploadValidation: Array<ValidationChain | ((req: Request, res: Response, next: NextFunction) => void)> = [
  // Validate file upload using multer
  (req: Request, res: Response, next: NextFunction): void => {
    upload(req, res, (err: Error | MulterError | null): void => {
      if (err) {
        return res.status(400).json({
          success: false,
          errors: [{ field: "file", message: err.message }],
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          errors: [{ field: "file", message: "No file uploaded" }],
        });
      }
      next();
    });
  },

  // Description field validation
  check("description")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Description cannot be more than 300 characters.")
    .trim()
    .escape(), // Sanitize to prevent XSS

  // Apply reusable validation handler
  validate,
];

/**
 * Reusable validation middleware to handle validation results and send structured errors.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
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
