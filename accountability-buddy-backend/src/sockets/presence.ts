import { Server, Socket } from "socket.io";
import redisClient from "../config/redisClient";
import logger from "../utils/winstonLogger";

const PRESENCE_KEY_PREFIX = "user_presence:";

const presenceSocket = (io: Server, socket: Socket): void => {
  const userId = socket.user.id as string;
  const userPresenceKey = `${PRESENCE_KEY_PREFIX}${userId}`;
  let activityTimeout: NodeJS.Timeout | null = null;

  const markUserOnline = async (): Promise<void> => {
    try {
      await redisClient.set(userPresenceKey, "online", "EX", 300);
      socket.broadcast.emit("userOnline", { userId });
      logger.info(`User ${userId} marked as online`);
    } catch (error) {
      logger.error(`Error marking user ${userId} as online: ${(error as Error).message}`);
    }
  };

  const markUserOffline = async (): Promise<void> => {
    try {
      await redisClient.del(userPresenceKey);
      socket.broadcast.emit("userOffline", { userId });
      logger.info(`User ${userId} marked as offline`);
    } catch (error) {
      logger.error(`Error marking user ${userId} as offline: ${(error as Error).message}`);
    }
  };

  const markUserInactive = async (): Promise<void> => {
    try {
      await redisClient.set(userPresenceKey, "inactive", "EX", 60);
      socket.broadcast.emit("userInactive", { userId });
      logger.info(`User ${userId} marked as inactive`);
    } catch (error) {
      logger.error(`Error marking user ${userId} as inactive: ${(error as Error).message}`);
    }
  };

  socket.on("activityPing", async (): Promise<void> => {
    try {
      await redisClient.set(userPresenceKey, "online", "EX", 300);
      logger.info(`User ${userId} sent activity ping`);

      if (activityTimeout) clearTimeout(activityTimeout);
      activityTimeout = setTimeout(markUserInactive, 60000);
    } catch (error) {
      logger.error(`Error processing activity ping for user ${userId}: ${(error as Error).message}`);
    }
  });

  markUserOnline();
  socket.on("disconnect", markUserOffline);
};

export default presenceSocket;
