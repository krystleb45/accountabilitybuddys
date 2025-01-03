import { Server, Socket } from "socket.io";
import Room from "../models/Room"; // Room model for database operations
import logger from "../utils/winstonLogger"; // Logger for tracking room events

interface RoomData {
  roomId?: string;
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

/**
 * @desc    Handles WebSocket events related to chat room interactions.
 * @param   io - The socket.io server instance.
 * @param   socket - The socket object representing the client's connection.
 */
const roomSocket = (io: Server, socket: Socket): void => {
  const userId = socket.user?.id; // Ensure user ID is available from the socket authentication

  /**
   * @desc    Creates a new room.
   * @param   roomData - The room details including name, description, and type.
   */
  socket.on("createRoom", async (roomData: RoomData) => {
    try {
      const { name, description, isPrivate } = roomData;

      if (!name || typeof name !== "string" || name.length < 3) {
        return socket.emit("error", {
          msg: "Room name is required and must be at least 3 characters long.",
        });
      }

      const newRoom = await Room.create({
        name,
        description,
        isPrivate: !!isPrivate,
        createdBy: userId,
        members: [userId], // Add the creator to the members list
      });

      logger.info(`Room created: ${newRoom.name} by user ${userId}`);
      socket.emit("roomCreated", newRoom); // Confirm room creation to the user
      if (!newRoom.isPrivate) io.emit("newRoom", newRoom); // Broadcast public room to all users
    } catch (error) {
      logger.error(`Error creating room: ${(error as Error).message}`);
      socket.emit("error", { msg: "Failed to create room." });
    }
  });

  /**
   * @desc    Joins an existing room.
   * @param   roomData - The room details including roomId.
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

      if (!room.members.includes(userId)) {
        room.members.push(userId);
        await room.save();
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
   * @param   roomData - The room details including roomId.
   */
  socket.on("leaveRoom", async (roomData: RoomData) => {
    try {
      const { roomId } = roomData;

      if (!roomId) {
        return socket.emit("error", { msg: "Room ID is required to leave a room." });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit("error", { msg: "Room not found." });
      }

      room.members = room.members.filter((member) => member.toString() !== userId);
      await room.save();

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
   * @desc    Fetches a list of available rooms.
   */
  socket.on("fetchRooms", async () => {
    try {
      const rooms = await Room.find({
        $or: [{ isPrivate: false }, { members: userId }],
      })
        .sort({ createdAt: -1 })
        .limit(20); // Limit results for scalability

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

export default roomSocket;
