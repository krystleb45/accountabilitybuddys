import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatBox from './ChatBox';
import { ChatBoxProps } from './Chat.types';
import { expect } from '@jest/globals';

describe('ChatBox Component', () => {
  const setup = (props: Partial<ChatBoxProps> = {}) => {
    const defaultProps: ChatBoxProps = {
      onSendMessage: jest.fn(),
      placeholder: 'Type a message...',
      disabled: false,
    };
    return render(<ChatBox {...defaultProps} {...props} />);
  };

  it('renders the input field and send button', () => {
    setup();
    expect(
      screen.getByPlaceholderText(/type a message.../i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('allows typing in the input field', () => {
    setup();
    const input = screen.getByPlaceholderText(
      /type a message.../i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    expect(input.value).toBe('Hello, world!');
  });

  it('calls onSendMessage with the correct message when send is clicked', () => {
    const onSendMessageMock = jest.fn();
    setup({ onSendMessage: onSendMessageMock });
    const input = screen.getByPlaceholderText(
      /type a message.../i
    ) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    expect(onSendMessageMock).toHaveBeenCalledTimes(1);
    expect(onSendMessageMock).toHaveBeenCalledWith('Test message');
    expect(input.value).toBe(''); // Ensures the input is cleared
  });

  it('does not call onSendMessage if the input is empty', () => {
    const onSendMessageMock = jest.fn();
    setup({ onSendMessage: onSendMessageMock });
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.click(button);

    expect(onSendMessageMock).not.toHaveBeenCalled();
  });

  it('disables the input and button when disabled prop is true', () => {
    setup({ disabled: true });
    const input = screen.getByPlaceholderText(/type a message.../i);
    const button = screen.getByRole('button', { name: /send/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('matches the snapshot', () => {
    const { container } = setup();
    expect(container.firstChild).toMatchSnapshot();
  });
});
