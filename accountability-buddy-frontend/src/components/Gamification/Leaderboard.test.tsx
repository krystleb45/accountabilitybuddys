import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Leaderboard from "./Leaderboard";
import { expect } from "@jest/globals";

describe("Leaderboard Component", () => {
  const mockEntries = [
    { rank: 1, name: "Alice", score: 100, isCurrentUser: false },
    { rank: 2, name: "Bob", score: 90, isCurrentUser: true },
    { rank: 3, name: "Charlie", score: 80, isCurrentUser: false },
  ];

  test("renders leaderboard container", () => {
    render(<Leaderboard entries={mockEntries} userId={""} />);
    const container = screen.getByTestId("leaderboard");
    expect(container).toBeInTheDocument();
  });

  test("displays the leaderboard title", () => {
    render(<Leaderboard entries={mockEntries} userId={""} />);
    const title = screen.getByText(/leaderboard/i);
    expect(title).toBeInTheDocument();
  });

  test("renders the correct number of rows", () => {
    render(<Leaderboard entries={mockEntries} userId={""} />);
    const rows = screen.getAllByTestId("leaderboard-row");
    expect(rows).toHaveLength(mockEntries.length);
  });

  test("renders rank, name, and score for each entry", () => {
    render(<Leaderboard entries={mockEntries} userId={""} />);
    mockEntries.forEach((entry) => {
      const rankCell = screen.getByText(entry.rank.toString());
      const nameCell = screen.getByText(entry.name);
      const scoreCell = screen.getByText(entry.score.toString());

      expect(rankCell).toBeInTheDocument();
      expect(nameCell).toBeInTheDocument();
      expect(scoreCell).toBeInTheDocument();
    });
  });

  test("highlights the current user's row", () => {
    render(<Leaderboard entries={mockEntries} userId={""} />);
    const currentUserRow = screen.getAllByTestId("leaderboard-row").find((row) =>
      row.classList.contains("current-user")
    );
    expect(currentUserRow).toBeInTheDocument();
    expect(currentUserRow).toHaveTextContent("Bob");
  });

  test("handles an empty leaderboard gracefully", () => {
    render(<Leaderboard entries={[]} userId={""} />);
    const rows = screen.queryAllByTestId("leaderboard-row");
    expect(rows).toHaveLength(0);

    const emptyMessage = screen.getByText(/no leaderboard entries available/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});
