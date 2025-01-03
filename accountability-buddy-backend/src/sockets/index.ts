import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import chatSocket from "./chat"; // Chat event handlers
import Notification from "../models/Notification"; // Notification model for real-time notifications
import { verifySocketToken } from "../services/AuthService"; // JWT token verification
import logger from "../utils/winstonLogger"; // Logger for socket events

interface DecodedToken {
  user: {
    id: string;
    username: string;
  };
}

/**
 * @desc    Initializes the socket server with event handlers and middleware.
 * @param   server - The HTTP server instance to attach the socket server to.
 * @returns The initialized socket.io server instance.
 */
const socketServer = (server: HttpServer): Server => {
  // Initialize socket.io server with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS || "*", // Define allowed origins
      methods: ["GET", "POST"], // Limit to GET and POST methods
      credentials: true, // Allow credentials for secure connections
    },
  });

  /**
   * @desc    Middleware to authenticate WebSocket connections using JWT.
   */
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.query.token as string ||
        (socket.handshake.headers["authorization"] as string);

      if (!token) {
        logger.warn("Socket connection attempted without a token.");
        return next(new Error("Authentication error: No token provided."));
      }

      // Verify the JWT token
      const decoded = verifySocketToken(token) as DecodedToken;
      socket.data.user = decoded.user; // Attach user info to socket
      next();
    } catch (error) {
      logger.error(`Socket authentication failed: ${(error as Error).message}`);
      next(new Error("Authentication error: Invalid token."));
    }
  });

  /**
   * @desc    Handles new socket connections.
   */
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.user.id;
    logger.info(`User connected: ${userId}`);

    // Handle chat events
    chatSocket(io, socket);

    /**
     * @desc    Fetches notifications for the connected user.
     */
    socket.on("fetchNotifications", async () => {
      try {
        const notifications = await Notification.find({ userId }).sort({
          date: -1,
        });
        socket.emit("notifications", notifications);
      } catch (error) {
        logger.error(
          `Error fetching notifications for user ${userId}: ${
            (error as Error).message
          }`
        );
        socket.emit("error", "Unable to fetch notifications.");
      }
    });

    /**
     * @desc    Handles new notifications.
     * @param   notification - The notification data to emit.
     */
    socket.on("newNotification", (notification: { userId: string }) => {
      if (notification && notification.userId) {
        io.to(notification.userId).emit("newNotification", notification);
      } else {
        logger.warn("Invalid notification data received.");
        socket.emit("error", "Invalid notification data.");
      }
    });

    /**
     * @desc    Handles user disconnection.
     */
    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${userId}`);
    });
  });

  return io;
};

export default socketServer;
