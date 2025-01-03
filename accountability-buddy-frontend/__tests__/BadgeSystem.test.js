import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BadgeSystem from "../src/components/BadgeSystem";
import * as gamificationService from "../src/services/gamificationService";

jest.mock("../src/services/gamificationService");

describe("BadgeSystem Component", () => {
  const user = { id: "1" };

  test("renders loading state", () => {
    render(<BadgeSystem user={user} />);
    expect(screen.getByText(/loading your achievements/i)).toBeInTheDocument();
  });

  test("displays badges and progress", async () => {
    const mockBadges = [
      { id: 1, name: "First Badge", description: "This is your first badge", icon: "/icons/first-badge.png" },
    ];
    const mockProgress = 30;

    gamificationService.fetchBadges.mockResolvedValueOnce(mockBadges);
    gamificationService.fetchUserProgress.mockResolvedValueOnce(mockProgress);

    render(<BadgeSystem user={user} />);

    await waitFor(() => {
      expect(screen.getByText(/your achievements/i)).toBeInTheDocument();
      expect(screen.getByText("First Badge")).toBeInTheDocument();
    });
  });

  test("displays error message on fetch failure", async () => {
    gamificationService.fetchBadges.mockRejectedValueOnce(new Error("Fetch error"));
    gamificationService.fetchUserProgress.mockRejectedValueOnce(new Error("Fetch error"));

    render(<BadgeSystem user={user} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
    });
  });
});
