import express, { Request, Response } from "express";
import Role from "../models/Role"; // Corrected model import path
import { roleBasedAccessControl } from "../middleware/roleBasedAccessControl"; // Corrected middleware import path
import authMiddleware from "../middleware/authMiddleware"; // Corrected middleware import path
import rateLimit from "express-rate-limit";
import logger from "../utils/winstonLogger"; // Logger utility

const router = express.Router();

/**
 * Rate limiter to prevent abuse of the roles route.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per IP
  message: "Too many requests. Please try again later.",
});

/**
 * @route   POST /roles/seed
 * @desc    Seed predefined roles into the database
 * @access  Private (Admin only)
 */
router.post(
  "/seed",
  authMiddleware,
  roleBasedAccessControl(["admin"]),
  rateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const roles = [
        { roleName: "admin", permissions: ["manage_users", "view_reports"] },
        { roleName: "user", permissions: ["view_content"] },
      ];

      const seededRoles = [];

      for (const role of roles) {
        const existingRole = await Role.findOne({ roleName: role.roleName });
        if (!existingRole) {
          const createdRole = await Role.create(role);
          seededRoles.push(createdRole);
        }
      }

      res.status(201).json({
        success: true,
        message: "Roles seeded successfully.",
        data: seededRoles,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Role seeding error: ${errorMessage}`);
      res.status(500).json({
        success: false,
        message: "Error seeding roles.",
        error: errorMessage,
      });
    }
  }
);

export default router;
