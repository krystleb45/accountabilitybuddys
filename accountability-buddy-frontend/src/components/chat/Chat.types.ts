// Chat.types.ts

/**
 * Represents a single chat message.
 */
export interface ChatMessage {
  id: string; // Unique identifier for the message
  sender: string; // Name or ID of the message sender
  content: string; // The text content of the message
  timestamp: Date; // Date and time when the message was sent
  isSystemMessage?: boolean; // Indicates if the message is a system-generated message
}

/**
 * Represents a user in the chat system.
 */
export interface ChatUser {
  id: string; // Unique identifier for the user
  name: string; // Display name of the user
  avatarUrl?: string; // Optional URL for the user's avatar
  isOnline: boolean; // Indicates whether the user is online
}

/**
 * Props for the ChatBox component.
 */
export interface ChatBoxProps {
  onSendMessage: (message: string) => void; // Callback when a message is sent
  placeholder?: string; // Placeholder text for the input box
  disabled?: boolean; // Disables the input box
}

/**
 * Props for the ChatWindow component.
 */
export interface ChatWindowProps {
  messages: ChatMessage[]; // Array of chat messages to display
  currentUser: ChatUser; // Information about the current user
  onSendMessage: (message: string) => void; // Callback when a message is sent
  onUserClick?: (userId: string) => void; // Optional callback when a user is clicked
  isLoading?: boolean; // Indicates if the chat is loading
}

/**
 * Represents the typing indicator in the chat.
 */
export interface TypingIndicator {
  userId: string; // ID of the user who is typing
  typing: boolean; // Indicates whether the user is currently typing
}
