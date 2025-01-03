import { Request, Response, NextFunction } from "express";
import History from "../models/History"; // Ensure you have a History model

/**
 * Get all history records
 */
export const getAllHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const histories = await History.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ success: true, data: histories });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific history record by ID
 */
export const getHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const history = await History.findById(id);

    if (!history) {
      res.status(404).json({ success: false, message: "History record not found" });
      return; // Ensure function ends here
    }

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new history record
 */
export const createHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { entity, action, details } = req.body;

    const newHistory = new History({
      entity,
      action,
      details,
      createdAt: new Date(),
    });

    const savedHistory = await newHistory.save();
    res.status(201).json({ success: true, data: savedHistory });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific history record by ID
 */
export const deleteHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedHistory = await History.findByIdAndDelete(id);

    if (!deletedHistory) {
      res.status(404).json({ success: false, message: "History record not found" });
      return; // Ensure function ends here
    }

    res.status(200).json({
      success: true,
      message: "History record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
