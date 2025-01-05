import { Response } from "express";
import User from "../models/User";
import Group from "../models/Group";
import sanitize from "mongo-sanitize";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import rateLimit from "express-rate-limit";
import { Document, Model } from "mongoose";

// Sanitize input helper
const sanitizeInput = (input: any): any => sanitize(input);

// Rate limiter for search requests
const searchRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many search requests, please try again later",
});

// Pagination utility
const paginate = async <T extends Document>(
  model: Model<T>,
  query: Record<string, unknown>,
  page: number,
  limit: number
): Promise<{ results: T[]; totalCount: number }> => {
  const [results, totalCount] = await Promise.all([
    model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    model.countDocuments(query),
  ]);

  return { results, totalCount };
};

/**
 * @desc Search for users
 * @route GET /api/search/users
 * @access Private
 */
export const searchUsers = [
  searchRateLimiter,
  catchAsync(
    async (
      req: CustomRequest<
        {},
        any,
        { query: string; page?: string; limit?: string }
      >,
      res: Response
    ): Promise<void> => {
      const query = sanitizeInput(req.query.query as string);
      const page = parseInt(sanitizeInput(req.query.page as string), 10) || 1;
      const limit = Math.min(
        parseInt(sanitizeInput(req.query.limit as string), 10) || 10,
        50
      );

      const searchQuery = {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };

      const { results: users, totalCount } = await paginate(
        User,
        searchQuery,
        page,
        limit
      );

      sendResponse(res, 200, true, "Users fetched successfully", {
        users,
        pagination: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    }
  ),
];

/**
 * @desc Search for groups
 * @route GET /api/search/groups
 * @access Private
 */
export const searchGroups = [
  searchRateLimiter,
  catchAsync(
    async (
      req: CustomRequest<
        {},
        any,
        { query: string; page?: string; limit?: string }
      >,
      res: Response
    ): Promise<void> => {
      const query = sanitizeInput(req.query.query as string);
      const page = parseInt(sanitizeInput(req.query.page as string), 10) || 1;
      const limit = Math.min(
        parseInt(sanitizeInput(req.query.limit as string), 10) || 10,
        50
      );

      const searchQuery = { name: { $regex: query, $options: "i" } };

      const { results: groups, totalCount } = await paginate(
        Group,
        searchQuery,
        page,
        limit
      );

      sendResponse(res, 200, true, "Groups fetched successfully", {
        groups,
        pagination: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    }
  ),
];
