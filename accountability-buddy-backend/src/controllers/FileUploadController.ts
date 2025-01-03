import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import sanitizeFilename from "sanitize-filename";
import { execSync } from "child_process";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import logger from "../utils/winstonLogger";

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitized = sanitizeFilename(file.originalname) || "default-file";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

const scanFileForVirus = (filePath: string): boolean => {
  try {
    const result = execSync(`clamscan ${filePath}`).toString();
    return !result.includes("FOUND");
  } catch (error) {
    logger.error("Error during virus scan: " + (error as Error).message);
    return false;
  }
};

const checkUserAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendResponse(res, 403, false, "Unauthorized access");
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const uploadFile = [
  checkUserAuthorization,
  upload.single("file"),
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      sendResponse(res, 400, false, "No file uploaded");
      return;
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    if (!scanFileForVirus(filePath)) {
      fs.unlinkSync(filePath);
      sendResponse(res, 400, false, "File contains a virus and was not uploaded");
      return;
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    sendResponse(res, 200, true, "File uploaded successfully", { fileUrl });
  }),
];

export const uploadMultipleFiles = [
  checkUserAuthorization,
  upload.array("files", 5),
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      sendResponse(res, 400, false, "No files uploaded");
      return;
    }

    const fileUrls: string[] = [];
    for (const file of req.files as Express.Multer.File[]) {
      const filePath = path.join(__dirname, "../uploads", file.filename);

      if (!scanFileForVirus(filePath)) {
        fs.unlinkSync(filePath);
        continue;
      }

      fileUrls.push(`${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    }

    if (fileUrls.length === 0) {
      sendResponse(res, 400, false, "No files uploaded due to virus detection");
      return;
    }

    sendResponse(res, 200, true, "Files uploaded successfully", { fileUrls });
  }),
];

export const deleteFile = [
  checkUserAuthorization,
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filename = sanitizeFilename(req.params.filename) || "unknown-file";
    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      sendResponse(res, 404, false, "File not found");
      return;
    }

    fs.unlinkSync(filePath);
    sendResponse(res, 200, true, "File deleted successfully");
  }),
];
