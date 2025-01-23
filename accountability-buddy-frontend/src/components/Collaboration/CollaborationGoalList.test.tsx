import React from 'react';
import {
  render,
  screen,
  fireEvent,
  RenderResult,
} from '@testing-library/react';
import CollaborationGoalList from './CollaborationGoalList';
import {
  CollaborationGoal,
  CollaborationGoalListProps,
} from './Collaboration.types';
import { expect } from '@jest/globals';

describe('CollaborationGoalList Component', () => {
  const mockGoals: CollaborationGoal[] = [
    {
      id: '1',
      title: 'Goal 1',
      description: 'This is the first goal.',
      assignedUsers: [],
      dueDate: new Date('2025-02-15'),
      status: 'pending',
      progress: 50,
    },
    {
      id: '2',
      title: 'Goal 2',
      description: 'This is the second goal.',
      assignedUsers: [],
      dueDate: new Date('2025-02-20'),
      status: 'in-progress',
      progress: 30,
    },
  ];

  const renderComponent = (
    props: Partial<CollaborationGoalListProps> = {}
  ): RenderResult => {
    const defaultProps: CollaborationGoalListProps = {
      goals: mockGoals,
      onGoalClick: jest.fn(),
      ...props,
    };
    return render(<CollaborationGoalList {...defaultProps} />);
  };

  it('renders a list of goals', (): void => {
    renderComponent();

    expect(screen.getByText('Goal 1')).toBeInTheDocument();
    expect(screen.getByText('This is the first goal.')).toBeInTheDocument();
    expect(screen.getByText('Goal 2')).toBeInTheDocument();
    expect(screen.getByText('This is the second goal.')).toBeInTheDocument();
  });

  it('calls the onGoalClick callback when a goal is clicked', () => {
    const onGoalClickMock = jest.fn();
    renderComponent({ onGoalClick: onGoalClickMock });

    const goal = screen.getByText('Goal 1');
    fireEvent.click(goal);

    expect(onGoalClickMock).toHaveBeenCalledTimes(1);
    expect(onGoalClickMock).toHaveBeenCalledWith('1');
  });

  it('renders an empty state when no goals are provided', () => {
    renderComponent({ goals: [] });

    expect(screen.getByText(/no goals to display/i)).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { container } = renderComponent();
    expect(container.firstChild).toMatchSnapshot();
  });
});
