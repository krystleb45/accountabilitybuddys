import express from "express";
import { globalRateLimiter } from "../utils/rateLimiter";
import path from "path";
import logger from "../utils/winstonLogger"; // Logger utility

logger.info(`Rate limiter path resolved: ${path.resolve(__dirname, "../utils/rateLimiter.ts")}`);

const app = express();

// Apply the global rate limiter middleware
app.use(globalRateLimiter);

app.get("/", (req, res) => {
  res.send("Hello! This is a rate-limited route.");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Test server running on http://localhost:${PORT}`);
});

logger.info(`Current directory: ${__dirname}`);
logger.info(`Current file: ${__filename}`);
