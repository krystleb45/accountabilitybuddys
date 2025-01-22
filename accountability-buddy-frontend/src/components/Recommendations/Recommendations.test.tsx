import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupRecommendations from './GroupRecommendations';
import IndividualRecommendations from './IndividualRecommendations';
import BookRecommendations from './BookRecommendations';
import { expect } from '@jest/globals';

describe('Recommendations Components', () => {
  describe('GroupRecommendations', () => {
    const mockGroups = [
      {
        id: '1',
        name: 'React Enthusiasts',
        description: 'Learn React together',
        membersCount: 25,
      },
      {
        id: '2',
        name: 'Fitness Fans',
        description: 'Share fitness tips and goals',
        membersCount: 40,
      },
    ];
    const mockOnJoinGroup = jest.fn();

    it('renders group recommendations correctly', () => {
      render(
        <GroupRecommendations
          recommendations={mockGroups}
          onJoinGroup={mockOnJoinGroup}
        />
      );

      expect(screen.getByText(/react enthusiasts/i)).toBeInTheDocument();
      expect(screen.getByText(/fitness fans/i)).toBeInTheDocument();
    });

    it('triggers onJoinGroup when the Join button is clicked', () => {
      render(
        <GroupRecommendations
          recommendations={mockGroups}
          onJoinGroup={mockOnJoinGroup}
        />
      );

      const joinButton = screen.getByLabelText(/join react enthusiasts/i);
      fireEvent.click(joinButton);

      expect(mockOnJoinGroup).toHaveBeenCalledWith('1');
    });
  });

  describe('IndividualRecommendations', () => {
    const mockIndividuals = [
      {
        id: '1',
        name: 'John Doe',
        bio: 'Software Engineer interested in web development',
        sharedGoals: ['Learn React', 'Build Portfolio'],
      },
      {
        id: '2',
        name: 'Jane Smith',
        bio: 'Fitness trainer passionate about healthy living',
        sharedGoals: ['Lose Weight', 'Run a Marathon'],
      },
    ];
    const mockOnConnect = jest.fn();

    it('renders individual recommendations correctly', () => {
      render(
        <IndividualRecommendations
          recommendations={mockIndividuals}
          onConnect={mockOnConnect}
        />
      );

      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });

    it('triggers onConnect when the Connect button is clicked', () => {
      render(
        <IndividualRecommendations
          recommendations={mockIndividuals}
          onConnect={mockOnConnect}
        />
      );

      const connectButton = screen.getByLabelText(/connect with john doe/i);
      fireEvent.click(connectButton);

      expect(mockOnConnect).toHaveBeenCalledWith('1');
    });
  });

  describe('BookRecommendations', () => {
    const mockBooks = [
      {
        id: '1',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt and David Thomas',
        description: 'A book about effective software development practices.',
        link: 'https://example.com/pragmatic-programmer',
      },
      {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'A guide to building good habits and breaking bad ones.',
        link: 'https://example.com/atomic-habits',
      },
    ];

    it('renders book recommendations correctly', () => {
      render(<BookRecommendations recommendations={mockBooks} />);

      expect(screen.getByText(/The Pragmatic Programmer/i)).toBeInTheDocument();
      expect(screen.getByText(/Atomic Habits/i)).toBeInTheDocument();
    });
  });
});
