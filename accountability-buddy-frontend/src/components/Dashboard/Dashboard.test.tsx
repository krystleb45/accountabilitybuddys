import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { expect } from "@jest/globals";

describe("Dashboard Component", () => {
  const mockProps = {
    userStats: {
      totalGoals: 10,
      completedGoals: 7,
      collaborations: 3,
    },
    recentActivities: [
      "Completed the 'Fitness Challenge' goal",
      "Collaborated with Alex on 'Project X'",
      "Started the 'Healthy Eating' goal",
    ],
    onAction: jest.fn(),
  };

  it("renders the dashboard header", () => {
    render(<Dashboard {...mockProps} />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent(/welcome to your dashboard/i);
  });

  it("renders user statistics", () => {
    render(<Dashboard {...mockProps} />);
    expect(screen.getByText(/total goals: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/completed goals: 7/i)).toBeInTheDocument();
    expect(screen.getByText(/collaborations: 3/i)).toBeInTheDocument();
  });

  it("renders recent activities", () => {
    render(<Dashboard {...mockProps} />);
    expect(screen.getByText(/completed the 'fitness challenge' goal/i)).toBeInTheDocument();
    expect(screen.getByText(/collaborated with alex on 'project x'/i)).toBeInTheDocument();
    expect(screen.getByText(/started the 'healthy eating' goal/i)).toBeInTheDocument();
  });

  it("renders a message if no recent activities are found", () => {
    render(<Dashboard {...mockProps} recentActivities={[]} />);
    expect(screen.getByText(/no recent activities found/i)).toBeInTheDocument();
  });

  it("calls the onAction function when the button is clicked", () => {
    render(<Dashboard {...mockProps} />);
    const button = screen.getByRole("button", { name: /perform action/i });
    fireEvent.click(button);
    expect(mockProps.onAction).toHaveBeenCalledWith("exampleAction");
  });

  it("matches the snapshot", () => {
    const { container } = render(<Dashboard {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
