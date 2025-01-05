import cors from "cors";

// Determine allowed origins from environment variables (comma-separated list)
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"]; // Default origin for development

// Configure CORS options with enhanced security
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ): void => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow standard HTTP methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Origin",
  ],
  exposedHeaders: [
    "Authorization" // Expose Authorization header for client-side handling
  ],
  credentials: true, // Enable cookies and credentials sharing
  optionsSuccessStatus: 200 // Respond with 200 for preflight requests
};

// Use type assertion directly to RequestHandler
const corsMiddleware = cors(corsOptions) as unknown as import("express").RequestHandler;

export default corsMiddleware;
