import { Request, Response, NextFunction } from "express";
import Milestone from "../models/Milestone"; // Ensure a corresponding Milestone model exists

/**
 * Get all milestones
 * @desc Fetch all milestones
 * @route GET /api/milestones
 * @access Public
 */
export const getAllMilestones = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const milestones = await Milestone.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: milestones });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new milestone
 * @desc Create and save a milestone
 * @route POST /api/milestones
 * @access Private
 */
export const createMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, dueDate } = req.body;

    const newMilestone = new Milestone({
      title,
      description,
      dueDate,
    });

    const savedMilestone = await newMilestone.save();
    res.status(201).json({ success: true, data: savedMilestone });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a milestone by ID
 * @desc Delete a specific milestone by ID
 * @route DELETE /api/milestones/:id
 * @access Private
 */
export const deleteMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedMilestone = await Milestone.findByIdAndDelete(id);

    if (!deletedMilestone) {
      res.status(404).json({ success: false, message: "Milestone not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Milestone deleted successfully" });
  } catch (error) {
    next(error);
  }
};
