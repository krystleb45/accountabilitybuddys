import session, { SessionOptions } from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";
import { Request, Response, NextFunction } from "express-serve-static-core";
import logger from "../utils/winstonLogger";

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => logger.error(`Redis client error: ${err.message}`));
redisClient.on("connect", () => logger.info("Connected to Redis server"));

(async (): Promise<void> => {
  try {
    await redisClient.connect(); // Ensure the client connects before use
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to connect to Redis: ${errMessage}`);
    process.exit(1); // Exit if Redis connection fails
  }
})();

// Initialize Redis store
const RedisStore = connectRedis(session);

const sessionStore = new RedisStore({
  client: redisClient as any,
});

// Configure session middleware
const SESSION_SECRET = process.env.SESSION_SECRET || "defaultsecret";

const sessionMiddleware = session({
  store: sessionStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
} as SessionOptions);

// Middleware wrapper to handle session
const enhancedSessionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  sessionMiddleware(req, res, (err?: any) => {
    if (err instanceof Error) {
      logger.error(`Session middleware error: ${err.message}`);
      res.status(500).json({ message: "Session handling error" });
    } else if (err) {
      logger.error("Session middleware encountered an unknown error");
      res.status(500).json({ message: "Unknown session handling error" });
    } else {
      // Log session details if available (only in development)
      if (req.session && process.env.NODE_ENV !== "production") {
        logger.debug(`Session ID: ${req.sessionID}`);
        logger.debug(`Session Data: ${JSON.stringify(req.session)}`);
      }
      next();
    }
  });
};

export default enhancedSessionMiddleware;
