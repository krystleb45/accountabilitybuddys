import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoalProgress from "./GoalProgress";
import { expect } from "@jest/globals";

describe("GoalProgress Component", () => {
    test("renders the goal progress container", () => {
        render(<GoalProgress goalTitle="My Goal" currentProgress={50} targetProgress={100} onEditGoal={() => {}} />);
        const container = screen.getByTestId("progress-bar");
        expect(container).toBeInTheDocument();
    });

    test("displays the correct progress percentage", () => {
        const progressValue = 75;
        render(<GoalProgress goalTitle="My Goal" currentProgress={progressValue} targetProgress={100} onEditGoal={() => {}} />);
        const progressBar = screen.getByTestId("progress-bar");
        expect(progressBar).toHaveStyle(`width: ${progressValue}%`);
        const label = screen.getByText(`${progressValue}%`);
        expect(label).toBeInTheDocument();
    });

    test("renders the optional description when provided", () => {
        const description = "Keep up the great work!";
        render(<GoalProgress progress={40} description={description} goalTitle={""} currentProgress={0} targetProgress={0} onEditGoal={function (): void {
            throw new Error("Function not implemented.");
        } } />);
        const descriptionElement = screen.getByText(description);
        expect(descriptionElement).toBeInTheDocument();
    });

    test("does not render the description when not provided", () => {
        render(<GoalProgress progress={40} goalTitle={""} currentProgress={0} targetProgress={0} onEditGoal={function (): void {
            throw new Error("Function not implemented.");
        } } />);
        const descriptionElement = screen.queryByText(/keep up/i); // No description should match
        expect(descriptionElement).not.toBeInTheDocument();
    });

    test("handles 0% progress correctly", () => {
        render(<GoalProgress progress={0} goalTitle={""} currentProgress={0} targetProgress={0} onEditGoal={function (): void {
            throw new Error("Function not implemented.");
        } } />);
        const progressBar = screen.getByTestId("progress-bar");
        expect(progressBar).toHaveStyle("width: 0%");
        const label = screen.getByText("0%");
        expect(label).toBeInTheDocument();
    });

    test("handles 100% progress correctly", () => {
        render(<GoalProgress progress={100} goalTitle={""} currentProgress={0} targetProgress={0} onEditGoal={function (): void {
            throw new Error("Function not implemented.");
        } } />);
        const progressBar = screen.getByTestId("progress-bar");
        expect(progressBar).toHaveStyle("width: 100%");
        const label = screen.getByText("100%");
        expect(label).toBeInTheDocument();
    });

    test("is accessible and has proper roles", () => {
        render(<GoalProgress progress={60} description="You're doing great!" goalTitle={""} currentProgress={0} targetProgress={0} onEditGoal={function (): void {
            throw new Error("Function not implemented.");
        } } />);
        const container = screen.getByTestId("progress-bar");
        expect(container).toHaveAttribute("role", "progressbar");
    });
});
