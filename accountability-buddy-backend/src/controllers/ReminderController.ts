import { Request, Response, NextFunction } from "express";
import { Reminder } from "../models/Reminder";
import Goal from "../models/Goal";
import { scheduleReminder } from "../services/ReminderService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import sanitize from "mongo-sanitize";

// Set a reminder for a goal
export const setReminder = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const { goalId, message, remindAt } = sanitize(req.body);
    const userId = req.user.id;

    const remindDate = new Date(remindAt);
    if (isNaN(remindDate.getTime()) || remindDate.getTime() <= Date.now()) {
      sendResponse(res, 400, false, "Reminder date must be in the future");
      return;
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      sendResponse(res, 404, false, "Goal not found or access denied");
      return;
    }

    const newReminder = new Reminder({
      user: userId,
      goal: goalId,
      message,
      remindAt: remindDate,
    });
    await newReminder.save();

    await scheduleReminder(newReminder);

    sendResponse(res, 201, true, "Reminder set successfully", {
      reminder: newReminder,
    });
  }
);

// Update a reminder
export const updateReminder = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const { reminderId } = req.params;
    const { message, remindAt } = sanitize(req.body);
    const userId = req.user.id;

    const remindDate = remindAt ? new Date(remindAt) : null;
    if (
      remindDate &&
      (isNaN(remindDate.getTime()) || remindDate.getTime() <= Date.now())
    ) {
      sendResponse(res, 400, false, "Reminder date must be in the future");
      return;
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, user: userId },
      { message, remindAt: remindDate },
      { new: true }
    );
    if (!reminder) {
      sendResponse(res, 404, false, "Reminder not found or access denied");
      return;
    }

    sendResponse(res, 200, true, "Reminder updated successfully", {
      reminder,
    });
  }
);

// Delete a reminder
export const deleteReminder = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const { reminderId } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOneAndDelete({
      _id: reminderId,
      user: userId,
    });
    if (!reminder) {
      sendResponse(res, 404, false, "Reminder not found or access denied");
      return;
    }

    sendResponse(res, 200, true, "Reminder deleted successfully");
  }
);

// Get user reminders
export const getUserReminders = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendResponse(res, 401, false, "User not authenticated");
      return;
    }

    const userId = req.user.id;

    const reminders = await Reminder.find({ user: userId }).sort({
      remindAt: 1,
    });

    sendResponse(res, 200, true, "Reminders fetched successfully", {
      reminders,
    });
  }
);
