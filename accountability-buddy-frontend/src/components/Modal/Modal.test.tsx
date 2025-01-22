import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";
import { expect } from "@jest/globals";

describe("Modal Component", () => {
  const onCloseMock = jest.fn();

  const renderModal = (isVisible: boolean) => {
    render(
      <Modal
        title="Test Modal"
        content={<p>Test Content</p>}
        isVisible={isVisible}
        onClose={onCloseMock}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the modal when isVisible is true", () => {
    renderModal(true);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();

    const title = screen.getByText("Test Modal");
    expect(title).toBeInTheDocument();

    const content = screen.getByText("Test Content");
    expect(content).toBeInTheDocument();
  });

  test("does not render the modal when isVisible is false", () => {
    renderModal(false);

    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    renderModal(true);

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("closes the modal when clicking on the overlay", () => {
    renderModal(true);

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("does not close the modal when clicking inside the modal content", () => {
    renderModal(true);

    const modalContent = screen.getByText("Test Content");
    fireEvent.click(modalContent);

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test("focuses on the modal when it becomes visible", () => {
    renderModal(true);

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveFocus();
  });

  test("closes the modal on Escape key press", () => {
    renderModal(true);

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
