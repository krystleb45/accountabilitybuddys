import { Server, Socket } from "socket.io";
import Room from "../models/Room"; // Assuming a Room model for database operations
import logger from "../utils/winstonLogger"; // Logger for tracking room events

interface RoomData {
  roomId?: string;
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

/**
 * @desc    Handles WebSocket events related to room management.
 * @param   io - The socket.io server instance.
 * @param   socket - The socket object representing the client's connection.
 */
const roomManagementSocket = (io: Server, socket: Socket): void => {
  const userId = socket.user?.id; // Ensure user ID is available from the socket

  /**
   * @desc    Creates a new chat room.
   * @param   roomData - The room data including name, description, and other options.
   */
  socket.on("createRoom", async (roomData: RoomData) => {
    try {
      const { name, description, isPrivate } = roomData;

      // Validate inputs
      if (!name || typeof name !== "string" || name.length < 3) {
        return socket.emit("error", {
          msg: "Room name is required and must be at least 3 characters long.",
        });
      }

      // Create a new room in the database
      const newRoom = await Room.create({
        name,
        description,
        isPrivate: !!isPrivate,
        createdBy: userId,
      });

      logger.info(`Room created: ${newRoom.name} by user ${userId}`);
      io.emit("roomCreated", newRoom); // Broadcast the new room to all connected clients
    } catch (error) {
      logger.error(`Error creating room: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to create room." });
    }
  });

  /**
   * @desc    Joins an existing room.
   * @param   roomData - The room data including roomId.
   */
  socket.on("joinRoom", async (roomData: RoomData) => {
    try {
      const { roomId } = roomData;

      if (!roomId) {
        return socket.emit("error", { msg: "Room ID is required to join a room." });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit("error", { msg: "Room not found." });
      }

      socket.join(roomId);
      logger.info(`User ${userId} joined room ${roomId}`);
      socket.to(roomId).emit("userJoinedRoom", { userId, roomId });

      socket.emit("roomJoined", { roomId, roomName: room.name });
    } catch (error) {
      logger.error(`Error joining room: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to join room." });
    }
  });

  /**
   * @desc    Leaves a room.
   * @param   roomData - The room data including roomId.
   */
  socket.on("leaveRoom", (roomData: RoomData) => {
    try {
      const { roomId } = roomData;

      if (!roomId) {
        return socket.emit("error", { msg: "Room ID is required to leave a room." });
      }

      socket.leave(roomId);
      logger.info(`User ${userId} left room ${roomId}`);
      socket.to(roomId).emit("userLeftRoom", { userId, roomId });

      socket.emit("roomLeft", { roomId });
    } catch (error) {
      logger.error(`Error leaving room: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to leave room." });
    }
  });

  /**
   * @desc    Deletes a room (for room admins or creators).
   * @param   roomData - The room data including roomId.
   */
  socket.on("deleteRoom", async (roomData: RoomData) => {
    try {
      const { roomId } = roomData;

      if (!roomId) {
        return socket.emit("error", { msg: "Room ID is required to delete a room." });
      }

      const room = await Room.findById(roomId);
      if (!room || room.createdBy.toString() !== userId) {
        return socket.emit("error", { msg: "Room not found or access denied." });
      }

      await room.remove();
      logger.info(`Room ${roomId} deleted by user ${userId}`);
      io.emit("roomDeleted", { roomId }); // Broadcast room deletion to all users
    } catch (error) {
      logger.error(`Error deleting room: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to delete room." });
    }
  });

  /**
   * @desc    Fetches a list of available rooms for the user.
   */
  socket.on("fetchRooms", async () => {
    try {
      const rooms = await Room.find({ isPrivate: false })
        .sort({ createdAt: -1 })
        .limit(20);

      socket.emit("roomsList", rooms);
    } catch (error) {
      logger.error(`Error fetching rooms: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to fetch rooms." });
    }
  });

  /**
   * @desc    Handles disconnection from room management.
   */
  socket.on("disconnect", () => {
    logger.info(`User ${userId} disconnected from room management`);
  });
};

export default roomManagementSocket;
