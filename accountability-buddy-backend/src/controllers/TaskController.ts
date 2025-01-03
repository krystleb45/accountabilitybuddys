import { Request, Response, NextFunction } from "express";

/**
 * @desc Fetch all tasks
 * @route GET /api/tasks
 * @access Public
 */
export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Simulated database fetch; replace with actual logic
    const tasks = [
      { id: 1, name: "Task 1", completed: false },
      { id: 2, name: "Task 2", completed: true },
    ];
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new task
 * @route POST /api/tasks
 * @access Public
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: "Task name is required" });
      return;
    }

    // Simulated task creation; replace with actual database operation
    const newTask = { id: Date.now(), name, completed: false };

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update a task
 * @route PUT /api/tasks/:id
 * @access Public
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      res
        .status(400)
        .json({ success: false, message: "Task completion status is required" });
      return;
    }

    // Simulated task update; replace with actual database operation
    const updatedTask = { id, completed };

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a task
 * @route DELETE /api/tasks/:id
 * @access Public
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Task ID is required" });
      return;
    }

    // Simulated task deletion; replace with actual database operation
    res
      .status(200)
      .json({ success: true, message: `Task ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
