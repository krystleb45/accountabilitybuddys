import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatWindow from './ChatWindow';
import { expect } from '@jest/globals';

describe('ChatWindow Component', () => {
  it('renders the chat window with a header, message area, and footer', () => {
    render(<ChatWindow />);

    expect(screen.getByText(/chatroom/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('displays messages in the chat area', () => {
    render(<ChatWindow />);

    // Simulate initial messages
    const messages = [
      { id: '1', sender: 'Alice', content: 'Hi there!' },
      { id: '2', sender: 'You', content: 'Hello!' },
    ];

    messages.forEach((msg) => {
      const messageElement = screen.getByText(msg.content);
      expect(messageElement).toBeInTheDocument();
    });
  });

  it('sends a message when the send button is clicked', () => {
    render(<ChatWindow />);

    const input = screen.getByPlaceholderText(
      /type a message/i
    ) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /send/i });

    // Type a message
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input.value).toBe('Test message');

    // Click send
    fireEvent.click(button);

    // Verify message appears in the chat area
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Verify input is cleared
    expect(input.value).toBe('');
  });

  it('disables the send button when the input is empty', () => {
    render(<ChatWindow />);

    const button = screen.getByRole('button', { name: /send/i });
    expect(button).toBeDisabled();
  });

  it('does not send a message if the input is empty', () => {
    render(<ChatWindow />);

    const button = screen.getByRole('button', { name: /send/i });

    // Try to click send with no message
    fireEvent.click(button);

    // Ensure no message appears in the chat area
    expect(screen.queryByText(/you:/i)).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { container } = render(<ChatWindow />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
