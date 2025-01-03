import { Server, Socket } from "socket.io";
import logger from "../utils/winstonLogger"; // Import your logger utility

interface TypingData {
  roomId: string;
}

/**
 * @desc    Handles WebSocket events related to typing indicators.
 * @param   {Server} io - The socket.io server instance.
 * @param   {Socket} socket - The socket object representing the client's connection.
 */
const typingIndicatorSocket = (io: Server, socket: Socket): void => {
  const userId = socket.user?.id as string; // User ID from socket authentication

  /**
   * @desc    Handles the 'startTyping' event, broadcasting to others in the same room.
   * @param   {TypingData} typingData - Data including roomId where the user is typing.
   */
  socket.on("startTyping", (typingData: TypingData): void => {
    const { roomId } = typingData;

    if (!roomId) {
      socket.emit("error", { msg: "Room ID is required to start typing." });
      return;
    }

    // Broadcast to other users in the room that this user has started typing
    socket.to(roomId).emit("userTyping", { userId, roomId, typing: true });
    logger.info(`User ${userId} started typing in room ${roomId}`);
  });

  /**
   * @desc    Handles the 'stopTyping' event, broadcasting to others in the same room.
   * @param   {TypingData} typingData - Data including roomId where the user stopped typing.
   */
  socket.on("stopTyping", (typingData: TypingData): void => {
    const { roomId } = typingData;

    if (!roomId) {
      socket.emit("error", { msg: "Room ID is required to stop typing." });
      return;
    }

    // Broadcast to other users in the room that this user has stopped typing
    socket.to(roomId).emit("userTyping", { userId, roomId, typing: false });
    logger.info(`User ${userId} stopped typing in room ${roomId}`);
  });

  /**
   * @desc    Handles user disconnection, ensuring that typing indicators are cleared.
   */
  socket.on("disconnect", (): void => {
    logger.info(`User ${userId} disconnected from typing indicator management`);

    // Broadcast that the user has stopped typing in all rooms
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("userTyping", { userId, roomId, typing: false });
    });
  });
};

export default typingIndicatorSocket;
