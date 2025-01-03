import express, { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import * as fileUploadController from "../controllers/FileUploadController"; // Corrected controller import path
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Added logger utility

const router = express.Router();

/**
 * Rate limiter to prevent excessive file uploads.
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 uploads per window
  message: "Too many uploads, please try again later",
});

/**
 * Multer configuration for file uploads.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the directory for uploads (ensure this directory exists)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set unique filenames
  },
});

/**
 * File filter for allowed types.
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter,
});

/**
 * @route   POST /file/upload
 * @desc    Upload a file
 * @access  Private
 */
router.post(
  "/upload",
  authMiddleware,
  uploadLimiter,
  upload.single("file"), // File input name is 'file'
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }
    next();
  },
  async (req: Request, res: Response): Promise<void> => {
    try {
      await fileUploadController.saveFileMetadata(req, res);
    } catch (error) {
      logger.error(`Error uploading file: ${(error as Error).message}`, { error });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   GET /file/download/:fileId
 * @desc    Download a file by ID
 * @access  Private
 */
router.get(
  "/download/:fileId",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { fileId } = req.params;
    if (!fileId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid file ID" });
    }

    try {
      await fileUploadController.downloadFile(req, res);
    } catch (error) {
      logger.error(`Error downloading file: ${(error as Error).message}`, { error });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

/**
 * @route   DELETE /file/delete/:fileId
 * @desc    Delete a file by ID
 * @access  Private
 */
router.delete(
  "/delete/:fileId",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { fileId } = req.params;
    if (!fileId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, msg: "Invalid file ID" });
    }

    try {
      await fileUploadController.deleteFile(req, res);
    } catch (error) {
      logger.error(`Error deleting file: ${(error as Error).message}`, { error });
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }
);

export default router;
