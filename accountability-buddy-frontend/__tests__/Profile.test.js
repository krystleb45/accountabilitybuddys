import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../src/context/AuthContext"; // Import the context provider
import Profile from "../src/components/Profile"; // Import the Profile component
import axios from "axios";

jest.mock("axios");

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  test("displays profile information", async () => {
    const mockProfile = {
      username: "testuser",
      email: "testuser@example.com",
      subscriptionStatus: "Premium",
    };

    axios.get.mockResolvedValueOnce({ data: mockProfile });

    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfile.username)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProfile.email)).toBeInTheDocument();
    });
  });

  test("handles errors when fetching profile", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to load profile"));

    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });

  test("submits updated profile", async () => {
    const mockProfile = {
      username: "testuser",
      email: "testuser@example.com",
      subscriptionStatus: "Premium",
    };

    axios.get.mockResolvedValueOnce({ data: mockProfile });
    axios.put.mockResolvedValueOnce({ data: mockProfile });

    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "newuser" } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "newuser@example.com" } });
      fireEvent.click(screen.getByText(/save changes/i));
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/users/profile/update"),
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });
});
