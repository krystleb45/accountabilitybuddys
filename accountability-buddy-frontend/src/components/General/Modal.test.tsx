import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';
import { expect } from '@jest/globals';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  const renderModal = (
    isOpen: boolean,
    title: string = '',
    children?: React.ReactNode
  ): void => {
    render(
      <Modal
        isOpen={isOpen}
        onClose={mockOnClose}
        title={title}
        content={undefined}
        isVisible={false}
      >
        {children}
      </Modal>
    );
  };

  test('renders nothing when isOpen is false', () => {
    renderModal(false);
    const overlay = screen.queryByTestId('modal-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  test('renders modal content when isOpen is true', () => {
    renderModal(true, 'Test Modal Title', <p>Modal content goes here</p>);

    const overlay = screen.getByTestId('modal-overlay');
    const modal = screen.getByTestId('modal');
    const title = screen.getByText('Test Modal Title');
    const content = screen.getByText('Modal content goes here');

    expect(overlay).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  test('calls onClose when clicking on the overlay', () => {
    renderModal(true);

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking inside the modal', () => {
    renderModal(true);

    const modal = screen.getByTestId('modal');
    fireEvent.click(modal);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('renders a close button and calls onClose when it is clicked', () => {
    renderModal(true);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
