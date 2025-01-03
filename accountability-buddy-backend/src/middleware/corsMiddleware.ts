import cors, { CorsOptions } from "cors";

// Determine allowed origins from environment variables (comma-separated list)
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",") // Split into array if multiple origins are provided
  : ["http://localhost:3000"]; // Default origin for development

// Configure CORS options with enhanced security
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Include additional methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Origin",
  ],
  exposedHeaders: [
    "Authorization", // Expose Authorization header to client-side apps
  ],
  credentials: true, // Enable cookies and credentials sharing
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204 status
};

// Create the CORS middleware
const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
