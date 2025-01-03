import axios from "axios";
import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import App from "./App";

jest.mock("axios"); // Mock the axios module

beforeEach(() => {
  jest.clearAllMocks(); // Clear all previous mocks to prevent interference
});

afterEach(() => {
  cleanup(); // Unmount components after each test
});

test("fetches and displays data from API", async () => {
  // Mock the API response
  axios.get.mockResolvedValueOnce({ data: { message: "Hello from API" } });

  render(<App />);

  // Check that loading text is displayed initially
  expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

  // Check if data from the API is displayed once it loads
  const dataElement = await screen.findByText(/Hello from API/i);
  expect(dataElement).toBeInTheDocument();
  expect(dataElement).toHaveAccessibleName("Message from API"); // Accessibility check

  // Verify that the loading text is removed after the data is loaded
  await waitFor(() => {
    expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
  });
});

test("handles API errors gracefully", async () => {
  // Mock the API to reject with an error
  axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

  render(<App />);

  // Check that loading text is displayed initially
  expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

  // Check if the error message is displayed after the API call fails
  const errorElement = await screen.findByText(/Failed to load data/i);
  expect(errorElement).toBeInTheDocument();
  expect(errorElement).toHaveAccessibleName("Error message"); // Accessibility check

  // Verify that the loading text is removed after the error is handled
  await waitFor(() => {
    expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
  });
});
