import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import * as HistoryController from "../controllers/HistoryController"; // Corrected controller import path
import logger from "../utils/winstonLogger"; // Added logger utility

const router = express.Router();

/**
 * @route   GET /history
 * @desc    Get user history
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id; // Ensure `req.user` is available through middleware
      const history = await HistoryController.getHistory(userId);
      res.status(200).json({ success: true, history });
    } catch (error) {
      logger.error("Error fetching user history", {
        error: error,
        userId: req.user?.id,
        ip: req.ip,
      });
      next(error); // Pass error to global error handler
    }
  }
);

/**
 * @route   DELETE /history/clear
 * @desc    Clear user history
 * @access  Private
 */
router.delete(
  "/clear",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id; // Ensure `req.user` is available through middleware
      const result = await HistoryController.clearHistory(userId);
      res
        .status(200)
        .json({ success: true, message: "History cleared successfully.", result });
    } catch (error) {
      logger.error("Error clearing user history", {
        error: error,
        userId: req.user?.id,
        ip: req.ip,
      });
      next(error); // Pass error to global error handler
    }
  }
);

export default router;
