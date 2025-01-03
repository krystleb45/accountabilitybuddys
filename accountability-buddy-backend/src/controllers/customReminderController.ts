import { Request, Response } from "express";
import mongoose from "mongoose";
import CustomReminder from "../models/CustomReminder";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import sanitize from "mongo-sanitize";

/**
 * @desc    Create a custom reminder
 * @route   POST /api/reminders
 * @access  Private
 */
export const createReminder = catchAsync(async (req: Request, res: Response) => {
  const { reminderMessage, reminderTime, recurrence }: 
    { reminderMessage: string; reminderTime: string; recurrence?: string } = sanitize(req.body);
  const userId = req.user?.id;

  if (!userId) {
    sendResponse(res, 400, false, "User ID is required");
    return;
  }

  if (!reminderMessage || !reminderTime) {
    sendResponse(res, 400, false, "Reminder message and time are required");
    return;
  }

  const parsedReminderTime = new Date(reminderTime);
  if (isNaN(parsedReminderTime.getTime()) || parsedReminderTime <= new Date()) {
    sendResponse(res, 400, false, "Reminder time must be a valid date in the future");
    return;
  }

  const newReminder = new CustomReminder({
    user: new mongoose.Types.ObjectId(userId),
    reminderMessage,
    reminderTime: parsedReminderTime,
    recurrence,
  });

  await newReminder.save();

  sendResponse(res, 201, true, "Custom reminder created successfully", { reminder: newReminder });
});

/**
 * @desc    Update a custom reminder
 * @route   PUT /api/reminders/:reminderId
 * @access  Private
 */
export const updateReminder = catchAsync(async (req: Request, res: Response) => {
  const { reminderId } = req.params;
  const { reminderMessage, reminderTime, recurrence }: 
    { reminderMessage?: string; reminderTime?: string; recurrence?: string } = sanitize(req.body);
  const userId = req.user?.id;

  if (!userId) {
    sendResponse(res, 400, false, "User ID is required");
    return;
  }

  if (!reminderMessage && !reminderTime && !recurrence) {
    sendResponse(res, 400, false, "At least one field must be updated");
    return;
  }

  const updateData: Partial<{ reminderMessage: string; reminderTime: Date; recurrence: string }> = {};
  if (reminderMessage) updateData.reminderMessage = reminderMessage;
  if (reminderTime) {
    const parsedReminderTime = new Date(reminderTime);
    if (isNaN(parsedReminderTime.getTime()) || parsedReminderTime <= new Date()) {
      sendResponse(res, 400, false, "Reminder time must be a valid date in the future");
      return;
    }
    updateData.reminderTime = parsedReminderTime;
  }
  if (recurrence) updateData.recurrence = recurrence;

  const updatedReminder = await CustomReminder.findOneAndUpdate(
    { _id: reminderId, user: new mongoose.Types.ObjectId(userId) },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedReminder) {
    sendResponse(res, 404, false, "Reminder not found or access denied");
    return;
  }

  sendResponse(res, 200, true, "Reminder updated successfully", { reminder: updatedReminder });
});

/**
 * @desc    Delete a custom reminder
 * @route   DELETE /api/reminders/:reminderId
 * @access  Private
 */
export const deleteReminder = catchAsync(async (req: Request, res: Response) => {
  const { reminderId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    sendResponse(res, 400, false, "User ID is required");
    return;
  }

  if (!reminderId) {
    sendResponse(res, 400, false, "Reminder ID is required");
    return;
  }

  const deletedReminder = await CustomReminder.findOneAndDelete({
    _id: reminderId,
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!deletedReminder) {
    sendResponse(res, 404, false, "Reminder not found or access denied");
    return;
  }

  sendResponse(res, 200, true, "Reminder deleted successfully");
});

/**
 * @desc    Get all custom reminders for the user
 * @route   GET /api/reminders
 * @access  Private
 */
export const getUserReminders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    sendResponse(res, 400, false, "User ID is required");
    return;
  }

  const reminders = await CustomReminder.find({
    user: new mongoose.Types.ObjectId(userId),
  }).sort({ reminderTime: 1 });

  if (!reminders.length) {
    sendResponse(res, 404, false, "No reminders found");
    return;
  }

  sendResponse(res, 200, true, "Reminders fetched successfully", { reminders });
});
