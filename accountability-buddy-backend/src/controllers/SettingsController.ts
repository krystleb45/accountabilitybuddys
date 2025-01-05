import { Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import sanitize from "mongo-sanitize";

/**
 * @desc Update account settings (profile, email, preferences)
 * @route PUT /api/settings/account
 * @access Private
 */
export const updateAccountSettings = catchAsync(
  async (
    req: CustomRequest<{}, any, { email?: string; username?: string }>,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;
    const updates = sanitize(req.body);

    // Prevent password changes through this route
    delete updates.password;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Account settings updated successfully", {
      user,
    });
  }
);

/**
 * @desc Change password
 * @route POST /api/settings/change-password
 * @access Private
 */
export const changePassword = catchAsync(
  async (
    req: CustomRequest<{}, any, { currentPassword: string; newPassword: string }>,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendResponse(res, 400, false, "Current and new passwords are required");
      return;
    }

    const user = await User.findById(userId).select("+password");
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      sendResponse(res, 400, false, "Incorrect current password");
      return;
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    sendResponse(res, 200, true, "Password updated successfully");
  }
);

/**
 * @desc Update email address (with verification)
 * @route POST /api/settings/update-email
 * @access Private
 */
export const updateEmail = catchAsync(
  async (
    req: CustomRequest<{}, any, { newEmail: string }>,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;
    const { newEmail } = req.body;

    if (!newEmail) {
      sendResponse(res, 400, false, "New email is required");
      return;
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      sendResponse(res, 400, false, "Email already in use");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    user.email = newEmail;
    await user.save();

    sendResponse(res, 200, true, "Email updated successfully", { email: newEmail });
  }
);

/**
 * @desc Toggle notification preferences
 * @route PATCH /api/settings/notifications
 * @access Private
 */
export const updateNotificationPreferences = catchAsync(
  async (
    req: CustomRequest<{}, any, { enableNotifications: boolean }>,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;
    const { enableNotifications } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    user.enableNotifications = enableNotifications;
    await user.save();

    sendResponse(res, 200, true, "Notification preferences updated successfully", {
      enableNotifications,
    });
  }
);

/**
 * @desc Delete user account
 * @route DELETE /api/settings/account
 * @access Private
 */
export const deleteAccount = catchAsync(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      sendResponse(res, 404, false, "User not found");
      return;
    }

    sendResponse(res, 200, true, "Account deleted successfully");
  }
);
