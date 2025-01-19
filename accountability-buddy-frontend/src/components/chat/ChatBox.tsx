import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { ChatBoxProps, ChatMessage } from "./Chat.types";

const socket: typeof Socket = io("http://localhost:5000", {
    autoConnect: false, // Prevents auto-connect on component mount
  });

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage, placeholder = "Type a message...", disabled = false }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.connect();

    // Listen for incoming messages
    socket.on("receiveMessage", (data: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect(); // Disconnects socket when component unmounts
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "You",
        content: message,
        timestamp: new Date(),
      };

      socket.emit("sendMessage", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      onSendMessage(message); // Trigger external callback if provided
    }
  };

  return (
    <div className="chat-box">
      <h2>Chatroom</h2>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Type your message"
      />
      <button onClick={sendMessage} disabled={disabled || !message.trim()}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
