import { Request } from "express";

// Extend Express's Request to include the 'user' property
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: "admin" | "user" | "moderator";
    isAdmin?: boolean;
  };
}
                                                                                   