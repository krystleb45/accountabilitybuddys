// routes/achievement.ts
import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware";
import * as AchievementController from "../controllers/AchievementController";

const router = express.Router();

// Updated rate limiter with more realistic limits
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allows 100 requests per window
  message: "Too many requests. Please try again later.",
});

const validateBody =
  (fields: string[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
      const missingFields = fields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(400).json({
          status: "fail",
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return; // Explicitly exit the function here
      }

      next(); // Explicitly return from the function after calling next()
    };

// Route to get all achievements
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Retrieve userId from req.user
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID is required.",
        });
        return; // Explicit return to ensure function ends here
      }

      // Call controller method
      const achievements = await AchievementController.getAllAchievements(userId);

      // Send response and explicitly end the function
      res.status(200).json({ success: true, data: achievements });
      return; // Explicit return to resolve the async function
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  }
);




// Route to add a new achievement
router.post(
  "/add",
  authMiddleware,
  rateLimiter,
  validateBody(["title", "description"]), // Validate required fields
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract and validate userId
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID is required.",
        });
        return; // Stop execution if userId is missing
      }

      const achievementData = req.body;

      // Call the controller method with valid userId
      const newAchievement = await AchievementController.addAchievement(
        userId, // Now guaranteed to be a string
        achievementData
      );

      res.status(201).json({
        message: "Achievement added successfully.",
        newAchievement,
      });
    } catch (error) {
      next(error);
    }
  }
);


// Route to delete an achievement
router.delete(
  "/delete",
  authMiddleware,
  validateBody(["achievementId"]), // Validate required field
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract achievementId from the request body
      const { achievementId } = req.body;

      // Validate that achievementId is provided
      if (!achievementId) {
        res.status(400).json({
          success: false,
          message: "Achievement ID is required.",
        });
        return;
      }

      // Call the controller method with achievementId
      const result = await AchievementController.deleteAchievement(achievementId);

      if (!result) {
        res.status(404).json({
          success: false,
          message: "Achievement not found.",
        });
        return;
      }

      res.status(200).json({
        message: "Achievement deleted successfully.",
        success: true,
      });
    } catch (error) {
      next(error); // Pass errors to the error handler
    }
  }
);


export default router;
