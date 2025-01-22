import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "./ErrorBoundary";
import { expect } from "@jest/globals";

// A test component to simulate errors
const ProblematicComponent: React.FC = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary Component", () => {
  test("renders children without errors when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="safe-child">This is safe content</div>
      </ErrorBoundary>
    );

    const child = screen.getByTestId("safe-child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("This is safe content");
  });

  test("displays fallback UI when an error occurs", () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    const fallbackMessage = screen.getByText(/something went wrong/i);
    expect(fallbackMessage).toBeInTheDocument();
  });

  test("displays custom fallback message if provided", () => {
    const customFallback = "Custom error message";

    render(
      <ErrorBoundary fallbackMessage={customFallback}>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    const fallbackMessage = screen.getByText(customFallback);
    expect(fallbackMessage).toBeInTheDocument();
  });

  test("logs errors to the console when an error occurs", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
