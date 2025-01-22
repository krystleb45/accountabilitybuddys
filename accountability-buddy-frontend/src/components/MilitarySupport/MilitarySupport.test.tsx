import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MilitarySupport from './MilitarySupport';
import { expect } from '@jest/globals';

describe('MilitarySupport Component', () => {
  test('renders the Military Support title', () => {
    render(<MilitarySupport />);

    const title = screen.getByRole('heading', { name: /military support/i });
    expect(title).toBeInTheDocument();
  });

  test('displays a list of resources', () => {
    render(<MilitarySupport />);

    const resources = screen.getAllByRole('link');
    expect(resources.length).toBeGreaterThan(0); // Ensure resources are present
    resources.forEach((resource) => {
      expect(resource).toHaveAttribute('href'); // Each resource should have a valid link
    });
  });

  test('renders the peer support chat button', () => {
    render(<MilitarySupport />);

    const chatButton = screen.getByRole('button', {
      name: /join peer support chat/i,
    });
    expect(chatButton).toBeInTheDocument();
  });

  test('navigates to the chat section when the chat button is clicked', () => {
    render(<MilitarySupport />);

    const chatButton = screen.getByRole('button', {
      name: /join peer support chat/i,
    });
    fireEvent.click(chatButton);

    const chatSection = screen.getByTestId('peer-support-chat');
    expect(chatSection).toBeInTheDocument();
  });

  test('displays a disclaimer message', () => {
    render(<MilitarySupport />);

    const disclaimer = screen.getByText(
      /this platform does not provide professional counseling/i
    );
    expect(disclaimer).toBeInTheDocument();
  });

  test('displays a feedback form button', () => {
    render(<MilitarySupport />);

    const feedbackButton = screen.getByRole('button', {
      name: /submit feedback/i,
    });
    expect(feedbackButton).toBeInTheDocument();
  });

  test('opens the feedback form when the feedback button is clicked', () => {
    render(<MilitarySupport />);

    const feedbackButton = screen.getByRole('button', {
      name: /submit feedback/i,
    });
    fireEvent.click(feedbackButton);

    const feedbackForm = screen.getByTestId('feedback-form');
    expect(feedbackForm).toBeInTheDocument();
  });
});
