import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

// Chat socket connection
let socket: typeof Socket;

interface Message {
  user: string;
  text: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStatus, setTypingStatus] = useState<string>('');
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socket = io('https://accountabilitybuddys.com', {
      reconnectionAttempts: 3, // Retry up to 3 times on disconnection
      transports: ['websocket'], // Use WebSocket for better performance
    });

    // Listen for incoming messages
    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);

      // Auto-scroll to the bottom of the chat window
      chatWindowRef.current?.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth',
      });
    });

    // Listen for typing status updates
    socket.on('typing', (user: string) => {
      setTypingStatus(`${user} is typing...`);
    });

    socket.on('stopTyping', () => {
      setTypingStatus('');
    });

    // Cleanup socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = { user: 'You', text: message };
      socket.emit('message', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');

      // Scroll to the bottom after sending a message
      chatWindowRef.current?.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing');

      // Stop typing after 2 seconds of inactivity
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
        socket.emit('stopTyping');
      }, 2000);

      return () => clearTimeout(typingTimeout);
    }
  };

  return (
    <div className="chat-window">
      <div
        className="messages"
        ref={chatWindowRef}
        style={{ overflowY: 'auto', maxHeight: '60vh' }}
      >
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      {typingStatus && <p className="typing-status">{typingStatus}</p>}
      <div
        className="chat-input-container"
        style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleTyping}
          placeholder="Type a message..."
          aria-label="Type your message"
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          style={{
            padding: '10px 16px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: message.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
