import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import sanitize from "mongo-sanitize";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import sendEmail from "../utils/sendEmail"; // For sending confirmation emails
import logger from "../utils/winstonLogger"; // Centralized logger

// Define file storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/profile_pictures");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitize(file.originalname)}`);
  },
});

// File filter for profile picture uploads
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }
};

// Multer middleware for profile picture uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit
  fileFilter: fileFilter,
});

/**
 * @desc View profile
 * @route GET /api/profile
 * @access Private
 */
export const getProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Profile fetched successfully", { user });
  },
);

/**
 * @desc Update profile information
 * @route PUT /api/profile
 * @access Private
 */
export const updateProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;
    const updates = sanitize(req.body);

    delete updates.email; // Prevent email update
    delete updates.password; // Prevent password update

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Profile updated successfully", {
      user: updatedUser,
    });
  },
);

/**
 * @desc Change password
 * @route POST /api/profile/change-password
 * @access Private
 */
export const changePassword = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = sanitize(req.body);

    if (!currentPassword || !newPassword) {
      sendResponse(res, 400, false, "Current and new passwords are required");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      sendResponse(res, 400, false, "Incorrect current password");
      return;
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    sendResponse(res, 200, true, "Password changed successfully");
  },
);

/**
 * @desc Update profile picture
 * @route POST /api/profile/update-picture
 * @access Private
 */
export const updateProfilePicture = [
  upload.single("profilePicture"),
  catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;

    if (!req.file) {
      sendResponse(res, 400, false, "No profile picture uploaded");
      return;
    }

    const fileUrl = `${req.protocol}://${req.get(
      "host",
    )}/uploads/profile_pictures/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: fileUrl },
      { new: true },
    ).select("-password");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Profile picture updated successfully", {
      user,
    });
  }),
];

/**
 * @desc Update email
 * @route POST /api/profile/update-email
 * @access Private
 */
export const updateEmail = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;
    const { newEmail } = sanitize(req.body);

    if (!newEmail) {
      sendResponse(res, 400, false, "New email is required");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    if (user.email === newEmail) {
      sendResponse(
        res,
        400,
        false,
        "New email cannot be the same as the current email",
      );
      return;
    }

    const token = jwt.sign(
      { id: userId, newEmail },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    const confirmationLink = `${req.protocol}://${req.get(
      "host",
    )}/confirm-email?token=${token}`;

    try {
      await sendEmail({
        to: newEmail,
        subject: "Email Update Confirmation",
        text: `Please confirm your email update by clicking the following link: ${confirmationLink}`,
        html: `<p>Please confirm your email by clicking the following link: <a href="${confirmationLink}" target="_blank" rel="noopener noreferrer">${confirmationLink}</a></p>`,
      });

      sendResponse(
        res,
        200,
        true,
        "Confirmation email sent. Please check your new email to confirm the update",
      );
    } catch (err) {
      logger.error("Error sending confirmation email:", err);
      sendResponse(
        res,
        500,
        false,
        "Failed to send confirmation email. Please try again later.",
      );
    }
  },
);

/**
 * @desc Confirm email update
 * @route GET /api/profile/confirm-email
 * @access Public
 */
export const confirmEmailUpdate = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query as { token: string };

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        newEmail: string;
      };
      const { id, newEmail } = decoded;

      const user = await User.findByIdAndUpdate(
        id,
        { email: newEmail },
        { new: true },
      ).select("-password");

      if (!user) {
        sendResponse(res, 404, false, "User not found");
        return;
      }

      sendResponse(res, 200, true, "Email updated successfully", { user });
    } catch (error) {
      logger.error("Error verifying email update token:", error);
      sendResponse(res, 400, false, "Invalid or expired token");
    }
  },
);
