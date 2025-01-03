import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware";
import sanitize from "mongo-sanitize";
import logger from "../utils/winstonLogger";
import { createTask, updateTask, deleteTask, getTaskById, getAllTasks } from "../controllers/TaskController";

const router = express.Router();

/**
 * @route   POST /tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  [
    check("title", "Task title is required").notEmpty(),
    check("dueDate", "Invalid due date").optional().isISO8601(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const sanitizedBody = sanitize(req.body);
      const newTask = await createTask(req.user.id, sanitizedBody);
      res.status(201).json(newTask);
    } catch (error) {
      logger.error("Error creating task: ", error);
      next(error);
    }
  }
);

/**
 * @route   GET /tasks
 * @desc    Get all tasks for the user
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await getAllTasks(req.user.id);
      res.status(200).json(tasks);
    } catch (error) {
      logger.error("Error fetching tasks: ", error);
      next(error);
    }
  }
);

/**
 * @route   GET /tasks/:id
 * @desc    Get a task by ID
 * @access  Private
 */
router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await getTaskById(req.user.id, req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json(task);
    } catch (error) {
      logger.error("Error fetching task: ", error);
      next(error);
    }
  }
);

/**
 * @route   PUT /tasks/:id
 * @desc    Update a task by ID
 * @access  Private
 */
router.put(
  "/:id",
  authMiddleware,
  [
    check("title", "Task title is required").optional().notEmpty(),
    check("dueDate", "Invalid due date").optional().isISO8601(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const sanitizedBody = sanitize(req.body);
      const updatedTask = await updateTask(req.user.id, req.params.id, sanitizedBody);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      logger.error("Error updating task: ", error);
      next(error);
    }
  }
);

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task by ID
 * @access  Private
 */
router.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedTask = await deleteTask(req.user.id, req.params.id);
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      logger.error("Error deleting task: ", error);
      next(error);
    }
  }
);

export default router;
