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

describe("App Component Tests", () => {
  test("fetches and displays data from API successfully", async () => {
    // Mock the API response
    axios.get.mockResolvedValueOnce({ data: { message: "Hello from API" } });

    render(<App />);

    // Assert that loading text is displayed initially
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

    // Assert that the data from the API is displayed correctly
    const dataElement = await screen.findByText(/Hello from API/i);
    expect(dataElement).toBeInTheDocument();
    expect(dataElement).toHaveAccessibleName("Message from API"); // Accessibility check

    // Assert that the loading text is removed after data loads
    await waitFor(() => {
      expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
    });

    // Verify that the API was called with the correct endpoint
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/api/data"); // Adjust endpoint as per your implementation
  });

  test("handles API errors gracefully", async () => {
    // Mock the API to reject with an error
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(<App />);

    // Assert that loading text is displayed initially
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

    // Assert that an error message is displayed after the API call fails
    const errorElement = await screen.findByText(/Failed to load data/i);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveAccessibleName("Error message"); // Accessibility check

    // Assert that the loading text is removed after the error is handled
    await waitFor(() => {
      expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
    });

    // Verify that the API was called once
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test("displays a fallback UI if no data is available", async () => {
    // Mock the API response with empty data
    axios.get.mockResolvedValueOnce({ data: {} });

    render(<App />);

    // Assert that loading text is displayed initially
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

    // Assert that fallback UI is displayed if no data is returned
    const fallbackElement = await screen.findByText(/No data available/i);
    expect(fallbackElement).toBeInTheDocument();

    // Verify that the loading text is removed after fallback is displayed
    await waitFor(() => {
      expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
    });

    // Verify that the API was called once
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
