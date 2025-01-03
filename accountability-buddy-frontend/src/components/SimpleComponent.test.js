import React from "react";
import { render, screen } from "@testing-library/react";
import SimpleComponent from "./SimpleComponent";

describe("SimpleComponent", () => {
  test("renders with default message", () => {
    render(<SimpleComponent />);

    // Check if the default message is rendered
    const element = screen.getByText(/Simple Component/i);
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("role", "contentinfo");
    expect(element).toHaveAttribute("aria-live", "polite");
  });

  test("renders with a custom message", () => {
    const customMessage = "Custom Message";
    render(<SimpleComponent message={customMessage} />);

    // Check if the custom message is rendered
    const element = screen.getByText(customMessage);
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("role", "contentinfo");
    expect(element).toHaveAttribute("aria-live", "polite");
  });

  test("updates content dynamically", () => {
    const { rerender } = render(<SimpleComponent message="Initial Message" />);

    // Verify initial render
    expect(screen.getByText(/Initial Message/i)).toBeInTheDocument();

    // Rerender with a new message
    rerender(<SimpleComponent message="Updated Message" />);

    // Verify the new message is displayed
    expect(screen.getByText(/Updated Message/i)).toBeInTheDocument();
  });
});
