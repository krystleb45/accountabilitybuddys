import { Response } from "express";
import {Reminder} from "../models/Reminder";
import Goal from "../models/Goal";
import { scheduleReminder } from "../services/ReminderService";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import sanitize from "mongo-sanitize";

/**
 * @desc Set a reminder for a goal
 * @route POST /api/reminders
 * @access Private
 */
export const setReminder = catchAsync(
  async (
    req: CustomRequest<{}, any, { goalId: string; message: string; remindAt: string }>,
    res: Response
  ): Promise<void> => {
    const { goalId, message, remindAt } = sanitize(req.body);
    const userId = req.user?.id;

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

    const newReminder = await Reminder.create({
      user: userId,
      goal: goalId,
      message,
      remindAt: remindDate,
    });

    await scheduleReminder(newReminder);

    sendResponse(res, 201, true, "Reminder set successfully", {
      reminder: newReminder,
    });
  }
);

/**
 * @desc Update a reminder
 * @route PUT /api/reminders/:reminderId
 * @access Private
 */
export const updateReminder = catchAsync(
  async (
    req: CustomRequest<{ reminderId: string }, any, { message?: string; remindAt?: string }>,
    res: Response
  ): Promise<void> => {
    const { reminderId } = req.params;
    const { message, remindAt } = sanitize(req.body);
    const userId = req.user?.id;

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

/**
 * @desc Delete a reminder
 * @route DELETE /api/reminders/:reminderId
 * @access Private
 */
export const deleteReminder = catchAsync(
  async (
    req: CustomRequest<{ reminderId: string }>,
    res: Response
  ): Promise<void> => {
    const { reminderId } = req.params;
    const userId = req.user?.id;

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

/**
 * @desc Get user reminders
 * @route GET /api/reminders
 * @access Private
 */
export const getUserReminders = catchAsync(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    const userId = req.user?.id;

    const reminders = await Reminder.find({ user: userId }).sort({
      remindAt: 1,
    });

    sendResponse(res, 200, true, "Reminders fetched successfully", {
      reminders,
    });
  }
);
