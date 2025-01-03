import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import sanitize from "mongo-sanitize";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware"; // Correct middleware import path
import roleBasedAccessControl from "../middleware/roleBasedAccessControl"; // Corrected RBAC middleware import path
import reportController from "../controllers/ReportController"; // Corrected controller import path
import logger from "../utils/winstonLogger"; // Logger utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of reporting functionality.
 */
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1-hour window
  max: 5, // Limit to 5 reports per IP per hour
  message: "Too many reports from this IP, please try again later.",
});

/**
 * Middleware for validating and sanitizing inputs.
 */
const reportValidation = [
  check("reportedId", "Reported ID is required and must be a valid Mongo ID").notEmpty().isMongoId(),
  check("reportType", "Report type is required and must be one of [post, comment, user]").notEmpty().isIn(["post", "comment", "user"]),
  check("reason", "Reason for reporting is required and must not exceed 300 characters").notEmpty().isLength({ max: 300 }),
];

const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  next();
};

/**
 * Middleware for handling validation errors.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

/**
 * @route   POST /report
 * @desc    Report a post, comment, or user
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  reportLimiter,
  reportValidation,
  sanitizeInput,
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { reportedId, reportType, reason } = req.body;
      await reportController.createReport(req.user.id, reportedId, reportType, reason);
      res.status(201).json({ success: true, message: "Report submitted successfully" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error creating report: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   GET /report
 * @desc    Get all reports (Admin only)
 * @access  Private (Admin only)
 */
router.get(
  "/",
  authMiddleware,
  roleBasedAccessControl(["admin"]),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reports = await reportController.getAllReports();
      res.status(200).json({ success: true, reports });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching reports: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   GET /report/:id
 * @desc    Get a specific report by ID (Admin only)
 * @access  Private (Admin only)
 */
router.get(
  "/:id",
  authMiddleware,
  roleBasedAccessControl(["admin"]),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reportId = sanitize(req.params.id);
      const report = await reportController.getReportById(reportId);

      if (!report) {
        return res.status(404).json({ success: false, message: "Report not found" });
      }

      res.status(200).json({ success: true, report });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error fetching report: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   PUT /report/:id/resolve
 * @desc    Resolve a report (Admin only)
 * @access  Private (Admin only)
 */
router.put(
  "/:id/resolve",
  authMiddleware,
  roleBasedAccessControl(["admin"]),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reportId = sanitize(req.params.id);
      const resolvedReport = await reportController.resolveReport(reportId, req.user.id);

      if (!resolvedReport) {
        return res.status(404).json({ success: false, message: "Report not found" });
      }

      res.status(200).json({ success: true, message: "Report resolved successfully" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error resolving report: ${errorMessage}`);
      next(error);
    }
  }
);

/**
 * @route   DELETE /report/:id
 * @desc    Delete a report (Admin only)
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authMiddleware,
  roleBasedAccessControl(["admin"]),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reportId = sanitize(req.params.id);
      const deletedReport = await reportController.deleteReport(reportId);

      if (!deletedReport) {
        return res.status(404).json({ success: false, message: "Report not found" });
      }

      res.status(200).json({ success: true, message: "Report deleted successfully" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error deleting report: ${errorMessage}`);
      next(error);
    }
  }
);

export default router;
