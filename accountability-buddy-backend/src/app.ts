import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import hpp from "hpp";
import bodyParser from "body-parser"; // Added for Stripe rawBody
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import newsletterRoutes from "./routes/newsletter";
import paymentRoutes from "./routes/payment"; // Added payment routes for Stripe
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/winstonLogger"; // Use Winston logger

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware for raw body parsing (needed for Stripe webhooks)
app.post(
  "/api/payments/webhook",
  bodyParser.raw({ type: "application/json" }), // Use raw body for Stripe
  (req, _res, next) => {
    (req as any).rawBody = req.body; // Explicitly set rawBody to avoid TypeScript errors
    next();
  }
);

// Middleware to parse JSON requests (for other routes)
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent payload attacks
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable deprecated rate limit headers
});
app.use(limiter);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for flexibility (adjust as needed)
  })
);
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*", // Allow cross-origin requests
    credentials: true, // Allow credentials
  })
);
app.use(mongoSanitize()); // Sanitize inputs to prevent NoSQL injection
app.use(xssClean()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP parameter pollution

// Logging Middleware
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()), // Integrate Morgan with Winston
    },
  })
);

// Compression Middleware
app.use(compression()); // Compress responses for better performance

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1); // Exit if unable to connect
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payments", paymentRoutes); // Added payments route

// Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "Healthy" });
});

// Handle 404 errors
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware
app.use(errorHandler);

// Handle Unhandled Promise Rejections & Uncaught Exceptions
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
