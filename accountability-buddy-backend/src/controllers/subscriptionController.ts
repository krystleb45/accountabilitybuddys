import { Request, Response } from "express";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

// Helper function to sanitize input manually
const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input.replace(/[^\w\s.@-]/g, ""); // Allow alphanumeric, whitespace, and common characters
  }
  if (typeof input === "object") {
    const sanitized: Record<string, any> = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
};

/**
 * @desc    Get user settings
 * @route   GET /api/settings
 * @access  Private
 */
export const getUserSettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendResponse(res, 401, false, "User not authenticated");
    return;
  }

  const userId = req.user.id;

  const user = await User.findById(userId).select("settings");

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  sendResponse(res, 200, true, "User settings fetched successfully", {
    settings: user.settings || {},
  });
});

/**
 * @desc    Update user settings
 * @route   PUT /api/settings
 * @access  Private
 */
export const updateUserSettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendResponse(res, 401, false, "User not authenticated");
    return;
  }

  const userId = req.user.id;
  const updates = sanitizeInput(req.body);

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { settings: updates } },
    { new: true, runValidators: true },
  ).select("settings");

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  sendResponse(res, 200, true, "User settings updated successfully", {
    settings: user.settings,
  });
});

/**
 * @desc    Update notification preferences
 * @route   PUT /api/settings/notifications
 * @access  Private
 */
export const updateNotificationPreferences = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;
    const { notifications } = sanitizeInput(req.body);

    if (!notifications) {
      sendResponse(res, 400, false, "Notification preferences are required");
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { "settings.notifications": notifications } },
      { new: true, runValidators: true },
    ).select("settings.notifications");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(
      res,
      200,
      true,
      "Notification preferences updated successfully",
      { notifications: user.settings?.notifications },
    );
  },
);

/**
 * @desc    Update privacy settings
 * @route   PUT /api/settings/privacy
 * @access  Private
 */
export const updatePrivacySettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendResponse(res, 401, false, "User not authenticated");
    return;
  }

  const userId = req.user.id;
  const { privacy } = sanitizeInput(req.body);

  if (!privacy) {
    sendResponse(res, 400, false, "Privacy settings are required");
    return;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { "settings.privacy": privacy } },
    { new: true, runValidators: true },
  ).select("settings.privacy");

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  sendResponse(res, 200, true, "Privacy settings updated successfully", {
    privacy: user.settings?.privacy,
  });
});

/**
 * @desc    Reset settings to default
 * @route   POST /api/settings/reset
 * @access  Private
 */
export const resetSettingsToDefault = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendResponse(res, 401, false, "User not authenticated");
    return;
  }

  const userId = req.user.id;

  const defaultSettings = {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisibility: "friends",
      searchVisibility: true,
    },
  };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { settings: defaultSettings } },
    { new: true, runValidators: true },
  ).select("settings");

  if (!user) {
    sendResponse(res, 404, false, "User not found");
    return;
  }

  sendResponse(res, 200, true, "Settings reset to default successfully", {
    settings: user.settings,
  });
});
