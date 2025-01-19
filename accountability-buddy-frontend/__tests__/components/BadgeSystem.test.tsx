import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import BadgeSystem from "../../src/components/BadgeSystem/BadgeSystem";
import * as gamificationService from "../../src/services/gamificationService";
import { Badge, UserProgress } from "../../src/types/Gamification";


// Mock the gamification service
jest.mock("../../services/gamificationService");

describe("BadgeSystem Component", () => {
  const user = { id: "1" };

  // Cleanup after each test
  afterEach(cleanup);

  test("renders loading state", () => {
    render(<BadgeSystem user={user} />);
    expect(screen.getByText(/loading your achievements/i)).toBeInTheDocument();
  });

  test("displays badges and progress", async () => {
    // Mock data matching the Badge and UserProgress interfaces
    const mockBadges: Badge[] = [
      {
        id: "1",
        name: "First Badge",
        description: "This is your first badge",
        imageUrl: "/icons/first-badge.png",
      },
    ];

    const mockProgress: UserProgress = {
      points: 120, // Example point value
      level: 3, // Example level value
      badges: mockBadges,
      newBadge: { name: "First Badge" }, // Optional new badge details
    };

    // Mock service calls
    jest.spyOn(gamificationService, "fetchBadges").mockResolvedValueOnce(mockBadges);
    jest.spyOn(gamificationService, "fetchUserProgress").mockResolvedValueOnce(mockProgress);

    render(<BadgeSystem user={user} />);

    await waitFor(() => {
      // Verify content
      expect(screen.getByText(/your achievements/i)).toBeInTheDocument();
      expect(screen.getByText("First Badge")).toBeInTheDocument();
      expect(screen.getByText(/level 3/i)).toBeInTheDocument(); // Example level check
    });
  });

  test("displays error message on fetch failure", async () => {
    // Mock service failure
    jest.spyOn(gamificationService, "fetchBadges").mockRejectedValueOnce(new Error("Fetch error"));
    jest.spyOn(gamificationService, "fetchUserProgress").mockRejectedValueOnce(new Error("Fetch error"));

    render(<BadgeSystem user={user} />);

    await waitFor(() => {
      // Verify error message
      expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
    });
  });
});