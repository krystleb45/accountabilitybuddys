import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProgressTracker from "./ProgressTracker";
import GoalDetails from "./GoalDetails";
import GoalAnalytics from "./GoalAnalytics";
import { getGoalAnalytics } from "src/services/goalService";
import { expect } from "@jest/globals";

jest.mock("../services/goalService");

describe("Progress Components", () => {
  describe("ProgressTracker", () => {
    it("renders correctly", () => {
      render(<ProgressTracker progress={0} />);
      expect(screen.getByText(/progress tracker/i)).toBeInTheDocument(); // Adjust based on actual text
    });
  });

  describe("GoalDetails", () => {
    const mockGoal = {
      id: "1",
      title: "Learn React",
      description: "Master React basics and advanced concepts",
      status: "In Progress",
      progress: 50,
    };
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    it("renders goal details correctly", () => {
      render(<GoalDetails goal={mockGoal} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
      expect(screen.getByText(/master react basics and advanced concepts/i)).toBeInTheDocument();
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();
      expect(screen.getByText(/50%/i)).toBeInTheDocument();
    });

    it("calls onEdit when the edit button is clicked", () => {
      render(<GoalDetails goal={mockGoal} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      fireEvent.click(screen.getByLabelText(/edit learn react/i));
      expect(mockOnEdit).toHaveBeenCalledWith("1");
    });

    it("calls onDelete when the delete button is clicked", () => {
      render(<GoalDetails goal={mockGoal} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      fireEvent.click(screen.getByLabelText(/delete learn react/i));
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
  });

  describe("GoalAnalytics", () => {
    it("renders loading state initially", () => {
      render(<GoalAnalytics />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("renders analytics chart correctly after fetching data", async () => {
      (getGoalAnalytics as jest.Mock).mockResolvedValue({
        data: {
          labels: ["Week 1", "Week 2"],
          datasets: [
            {
              label: "Goals Completed",
              data: [5, 10],
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
              fill: true,
            },
          ],
        },
      });

      render(<GoalAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/goals completed/i)).toBeInTheDocument();
        expect(screen.getByText(/week 1/i)).toBeInTheDocument();
        expect(screen.getByText(/week 2/i)).toBeInTheDocument();
      });
    });

    it("displays an error message when analytics fetch fails", async () => {
      (getGoalAnalytics as jest.Mock).mockRejectedValue(new Error("Failed to load analytics"));

      render(<GoalAnalytics />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load analytics/i)).toBeInTheDocument();
      });
    });
  });
});
