import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Gamification from './Gamification';
import { expect } from "@jest/globals";

describe('Gamification Component', () => {
    test('renders the gamification header', () => {
        render(<Gamification user={null} />);
        const headerElement = screen.getByText(/gamification/i); // Adjust text based on the header in Gamification.tsx
        expect(headerElement).toBeInTheDocument();
    });

    test('displays achievement badges', () => {
        render(<Gamification user={null} />);
        const badges = screen.getAllByTestId('achievement-badge'); // Ensure badges have `data-testid="achievement-badge"`
        expect(badges.length).toBeGreaterThan(0);
    });

    test('handles badge hover interaction', () => {
        render(<Gamification user={null} />);
        const badge = screen.getAllByTestId('achievement-badge')[0];
        fireEvent.mouseOver(badge);
        expect(badge).toHaveStyle('transform: scale(1.1)');
    });

    test('renders the progress bar', () => {
        render(<Gamification user={null} />);
        const progressBar = screen.getByTestId('progress-bar'); // Ensure progress bar has `data-testid="progress-bar"`
        expect(progressBar).toBeInTheDocument();
    });

    test('progress bar width updates correctly', () => {
        render(<Gamification user={null} />);
        const progressBar = screen.getByTestId('progress-bar');
        // Assuming a progress prop or state value determines the width
        expect(progressBar).toHaveStyle('width: 50%'); // Adjust based on default progress value
    });

    test('renders the leaderboard', () => {
        render(<Gamification user={null} />);
        const leaderboardHeader = screen.getByText(/leaderboard/i); // Adjust text based on leaderboard header
        expect(leaderboardHeader).toBeInTheDocument();
    });

    test('renders leaderboard items', () => {
        render(<Gamification user={null} />);
        const leaderboardItems = screen.getAllByTestId('leaderboard-item'); // Ensure items have `data-testid="leaderboard-item"`
        expect(leaderboardItems.length).toBeGreaterThan(0);
    });

    test('handles leaderboard item click', () => {
        render(<Gamification user={null} />);
        const leaderboardItem = screen.getAllByTestId('leaderboard-item')[0];
        fireEvent.click(leaderboardItem);
        // Add assertions based on the click behavior, e.g., navigation or modal opening
        expect(leaderboardItem).toHaveClass('active'); // Example of an active class being added
    });
});
