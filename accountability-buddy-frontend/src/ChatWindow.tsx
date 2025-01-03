import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Define types for messages and socket
interface Message {
  user: string;
  text: string;
}

let socket: Socket;

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStatus, setTypingStatus] = useState<string>("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    socket = io("https://accountabilitybuddys.com", {
      reconnectionAttempts: 3,
    });

    // Listen for incoming messages
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for typing status
    socket.on("typing", (user: string) => {
      setTypingStatus(`${user} is typing...`);
    });

    socket.on("stopTyping", () => {
      setTypingStatus("");
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    // Cleanup socket on component unmount
    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit("typing");
      setIsTyping(true);
    }

    // Stop typing after 1 second of inactivity
    setTimeout(() => {
      socket.emit("stopTyping");
      setIsTyping(false);
    }, 1000);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      socket.emit("chatMessage", message, (error?: string) => {
        if (error) {
          console.error("Message could not be sent:", error);
        }
      });

      setMessages((prev) => [
        ...prev,
        { user: "You", text: message }, // Adding local user's message
      ]);
      setMessage("");
    }
  };

  return (
    <div>
      <div
        className="chat-window"
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
        ref={chatWindowRef}
        aria-live="polite"
      >
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.user}:</strong> {msg.text}
            </li>
          ))}
        </ul>
        {typingStatus && <p aria-live="polite">{typingStatus}</p>}
      </div>
      <form onSubmit={sendMessage}>
        <input
          className="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={handleTyping} // Updated for modern event
          placeholder="Enter message"
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
          aria-label="Message input"
        />
        <button
          className="send-button"
          type="submit"
          disabled={!message.trim()}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
