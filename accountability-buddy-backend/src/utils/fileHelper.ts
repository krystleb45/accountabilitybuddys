import fs from "fs";
import path from "path";
import multer from "multer";

// Allowed file types for upload (e.g., images, PDFs)
const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

/**
 * @desc    Multer setup for file uploads with validation, file size limit, and destination folder.
 * @returns {multer.Multer} - Multer upload configuration.
 */
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../uploads");
      ensureDirectoryExists(uploadDir); // Ensure the upload directory exists
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
      );
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
    }
  },
});

/**
 * @desc    Deletes a file from the file system.
 * @param   {string} filePath - The path of the file to delete.
 * @returns {Promise<void>} - Resolves if the file is deleted, rejects if an error occurs.
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    throw new Error(`Failed to delete file: ${(err as Error).message}`);
  }
};

/**
 * @desc    Validates a file extension.
 * @param   {string} filename - The name of the file to validate.
 * @returns {boolean} - Returns true if the file has a valid extension, false otherwise.
 */
export const validateFileExtension = (filename: string): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return [".jpeg", ".jpg", ".png", ".pdf"].includes(ext);
};

/**
 * @desc    Ensures a directory exists, creates it if it doesn't.
 * @param   {string} dirPath - The path of the directory to ensure.
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * @desc    Reads a file from the file system.
 * @param   {string} filePath - The path of the file to read.
 * @returns {Promise<string>} - Resolves with the file content, rejects if an error occurs.
 */
export const readFile = async (filePath: string): Promise<string> => {
  try {
    return await fs.promises.readFile(filePath, "utf8");
  } catch (err) {
    throw new Error(`Failed to read file: ${(err as Error).message}`);
  }
};

/**
 * @desc    Writes data to a file in the file system.
 * @param   {string} filePath - The path of the file to write to.
 * @param   {string} data - The data to write to the file.
 * @returns {Promise<void>} - Resolves if the file is written, rejects if an error occurs.
 */
export const writeFile = async (
  filePath: string,
  data: string,
): Promise<void> => {
  try {
    await fs.promises.writeFile(filePath, data, "utf8");
  } catch (err) {
    throw new Error(`Failed to write file: ${(err as Error).message}`);
  }
};

export default {
  upload,
  deleteFile,
  validateFileExtension,
  ensureDirectoryExists,
  readFile,
  writeFile,
};
