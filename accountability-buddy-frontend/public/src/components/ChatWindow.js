import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Chat socket connection
let socket;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const chatWindowRef = useRef(null); // Using a ref for the chat window

  useEffect(() => {
    // Initialize socket connection
    socket = io('https://accountabilitybuddys.com', {
      reconnectionAttempts: 3, // Automatically try to reconnect if connection drops
    });

    // Listen for incoming messages
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for typing status from other users
    socket.on('typing', (user) => {
      setTypingStatus(`${user} is typing...`);
    });

    socket.on('stopTyping', () => {
      setTypingStatus('');
    });

    // Handle connection errors
    socket.on('connect_error', () => {
      console.error('Socket connection failed');
    });

    // Cleanup socket connection when component unmounts
    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('stopTyping');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to the bottom when a new message is received
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit('typing');
      setIsTyping(true);
    }

    // Stop typing after 1 second of inactivity
    setTimeout(() => {
      socket.emit('stopTyping');
      setIsTyping(false);
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      // Emit the message to the server
      socket.emit('chatMessage', message, (error) => {
        if (error) {
          console.error('Message could not be sent: ', error);
        }
      });

      // Clear the message input field
      setMessage('');
    }
  };

  return (
    <div>
      <div
        className="chat-window"
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
        }}
        ref={chatWindowRef}
        aria-live="polite"  // Accessibility: Announce new messages
      >
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        {/* Show typing indicator */}
        {typingStatus && <p aria-live="polite">{typingStatus}</p>}
      </div>
      <form onSubmit={sendMessage}>
        <input
          className="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Enter message"
          style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          aria-label="Message input" // Accessibility: Label for message input
        />
        <button
          className="send-button"
          type="submit"
          disabled={!message.trim()}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
