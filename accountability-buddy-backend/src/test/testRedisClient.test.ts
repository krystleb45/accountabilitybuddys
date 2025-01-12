import { createClient } from "@redis/client";
import logger from "../utils/winstonLogger"; // Logger utility for consistent logging

const testRedis = async (): Promise<void> => {
  const redisClient = createClient();
  await redisClient.connect();

  try {
    // Send a simple command to Redis
    const response = await redisClient.sendCommand(["PING"]);
    logger.info(`PING response: ${response}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`Error in testRedis: ${errorMessage}`);
  } finally {
    await redisClient.quit();
    logger.info("Redis client disconnected successfully.");
  }
};

// Execute the test
testRedis().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : "Unexpected error during testRedis execution";
  logger.error(`Unhandled error: ${errorMessage}`);
});
