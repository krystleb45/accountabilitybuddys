// ChatUtils.ts

import { ChatMessage } from './Chat.types';

/**
 * Formats a timestamp into a human-readable string.
 * @param timestamp - The timestamp to format.
 * @returns A formatted string, e.g., "Jan 18, 2025, 3:45 PM".
 */
export const formatTimestamp = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);
};

/**
 * Filters and sanitizes chat messages to prevent XSS or malicious content.
 * @param messages - The array of chat messages to sanitize.
 * @returns A sanitized array of chat messages.
 */
export const sanitizeMessages = (messages: ChatMessage[]): ChatMessage[] => {
  return messages.map((message) => ({
    ...message,
    content: sanitizeString(message.content),
  }));
};

/**
 * Sanitizes a string by escaping HTML tags to prevent XSS.
 * @param str - The string to sanitize.
 * @returns A sanitized string.
 */
export const sanitizeString = (str: string): string => {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
};

/**
 * Groups messages by sender for better UI organization.
 * @param messages - The array of chat messages to group.
 * @returns An array of grouped chat messages by sender.
 */
export const groupMessagesBySender = (
  messages: ChatMessage[]
): { sender: string; messages: ChatMessage[] }[] => {
  const grouped: { [key: string]: ChatMessage[] } = {};
  messages.forEach((message) => {
    if (!grouped[message.sender]) {
      grouped[message.sender] = [];
    }
    grouped[message.sender].push(message);
  });
  return Object.entries(grouped).map(([sender, messages]) => ({
    sender,
    messages,
  }));
};

/**
 * Simulates a typing indicator for a user.
 * @param userId - The ID of the user typing.
 * @param delay - The delay in milliseconds before the indicator stops.
 * @param callback - A callback function to invoke when typing stops.
 */
export const simulateTypingIndicator = (
  userId: string,
  delay: number,
  callback: () => void
): void => {
  setTimeout(callback, delay);
};

/**
 * Validates a chat message to ensure it meets basic requirements.
 * @param message - The message to validate.
 * @returns True if the message is valid; otherwise, false.
 */
export const isValidMessage = (message: string): boolean => {
  return message.trim().length > 0;
};
