import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

// Chat socket connection
let socket: Socket;

interface Message {
  user: string;
  text: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStatus, setTypingStatus] = useState<string>("");
  const chatWindowRef = useRef<HTMLDivElement | null>(null); // Using a ref for the chat window

  useEffect(() => {
    // Initialize socket connection
    socket = io("https://accountabilitybuddys.com", {
      reconnectionAttempts: 3, // Automatically try to reconnect if connection drops
    });

    // Listen for incoming messages
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for typing status from other users
    socket.on("typing", (user: string) => {
      setTypingStatus(`${user} is typing...`);
    });

    socket.on("stopTyping", () => {
      setTypingStatus("");
    });

    // Handle cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = { user: "You", text: message };
      socket.emit("message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing");

      // Stop typing status after a delay
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stopTyping");
      }, 2000);
    }
  };

  return (
    <div className="chat-window" ref={chatWindowRef}>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      {typingStatus && <p className="typing-status">{typingStatus}</p>}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleTyping}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
