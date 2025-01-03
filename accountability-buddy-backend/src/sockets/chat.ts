import { Server, Socket } from "socket.io";
import Chat from "../models/Chat"; // Chat model for storing messages
import Group from "../models/Group"; // Group model for managing groups
import User from "../models/User"; // User model for user details
import logger from "../utils/winstonLogger"; // Logger utility

interface JoinRoomData {
  roomId: string;
  userId: string;
}

interface LeaveRoomData {
  roomId: string;
  userId: string;
}

interface SendMessageData {
  roomId: string;
  userId: string;
  message: string;
}

interface FetchChatHistoryData {
  roomId: string;
}

const chatSocket = (io: Server, socket: Socket): void => {
  /**
   * @desc  User joins a chat room (group chat or direct message room)
   */
  socket.on("joinRoom", async ({ roomId, userId }: JoinRoomData) => {
    try {
      if (!roomId || !userId) {
        return socket.emit("error", "Room ID and User ID are required.");
      }

      socket.join(roomId);
      logger.info(`User ${userId} joined room ${roomId}`);

      // Notify others in the room that a user has joined
      socket.to(roomId).emit("userJoined", { userId, roomId });
    } catch (error) {
      logger.error(`Error joining room: ${(error as Error).message}`);
      socket.emit("error", "Unable to join room.");
    }
  });

  /**
   * @desc  User leaves a chat room
   */
  socket.on("leaveRoom", ({ roomId, userId }: LeaveRoomData) => {
    try {
      if (!roomId || !userId) {
        return socket.emit("error", "Room ID and User ID are required.");
      }

      socket.leave(roomId);
      logger.info(`User ${userId} left room ${roomId}`);

      // Notify others in the room that a user has left
      socket.to(roomId).emit("userLeft", { userId, roomId });
    } catch (error) {
      logger.error(`Error leaving room: ${(error as Error).message}`);
      socket.emit("error", "Unable to leave room.");
    }
  });

  /**
   * @desc  Send a new chat message
   */
  socket.on("sendMessage", async ({ roomId, userId, message }: SendMessageData) => {
    try {
      if (!message || !roomId || !userId) {
        return socket.emit("error", "Message content, room, and user must be provided.");
      }

      const user = await User.findById(userId);
      if (!user) {
        return socket.emit("error", "User not found.");
      }

      const room = await Group.findById(roomId);
      if (!room) {
        return socket.emit("error", "Room not found.");
      }

      const newMessage = new Chat({
        message,
        sender: userId,
        group: roomId,
        createdAt: new Date(),
      });

      await newMessage.save();

      io.to(roomId).emit("newMessage", {
        message: newMessage.message,
        sender: {
          id: user._id,
          username: user.username,
        },
        roomId,
        createdAt: newMessage.createdAt,
      });

      logger.info(`Message sent by user ${user.username} in room ${roomId}`);
    } catch (error) {
      logger.error(`Error sending message: ${(error as Error).message}`);
      socket.emit("error", "Unable to send message.");
    }
  });

  /**
   * @desc  Fetch chat history for a specific room
   */
  socket.on("fetchChatHistory", async ({ roomId }: FetchChatHistoryData) => {
    try {
      if (!roomId) {
        return socket.emit("error", "Room ID is required.");
      }

      const chatHistory = await Chat.find({ group: roomId })
        .populate("sender", "username")
        .sort({ createdAt: 1 });

      socket.emit("chatHistory", chatHistory);
    } catch (error) {
      logger.error(`Error fetching chat history: ${(error as Error).message}`);
      socket.emit("error", "Unable to fetch chat history.");
    }
  });

  /**
   * @desc  Handle user disconnection
   */
  socket.on("disconnect", () => {
    logger.info("A user disconnected");
  });
};

export default chatSocket;
