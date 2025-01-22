import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "../Footer/SidebarFooter";
import { expect } from "@jest/globals";

describe("Sidebar Components", () => {
  describe("Sidebar", () => {
    it("renders the sidebar correctly", () => {
      render(<Sidebar isVisible={false} />);

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("SidebarItem", () => {
    const mockOnClick = jest.fn();

    it("renders a sidebar item with a label", () => {
      render(<SidebarItem label="Dashboard" onClick={mockOnClick} />);

      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    it("calls the onClick function when clicked", () => {
      render(<SidebarItem label="Settings" onClick={mockOnClick} />);

      const item = screen.getByText(/settings/i);
      fireEvent.click(item);

      expect(mockOnClick).toHaveBeenCalled();
    });

    it("applies the active class when isActive is true", () => {
      render(<SidebarItem label="Profile" isActive={true} />);

      const item = screen.getByText(/profile/i);
      expect(item.parentElement).toHaveClass("active");
    });
  });

  describe("SidebarFooter", () => {
    const mockOnThemeToggle = jest.fn();
    const mockOnLogout = jest.fn();

    it("renders the sidebar footer buttons", () => {
      render(
        <SidebarFooter onThemeToggle={mockOnThemeToggle} onLogout={mockOnLogout} />
      );

      expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("calls onThemeToggle when the theme toggle button is clicked", () => {
      render(
        <SidebarFooter onThemeToggle={mockOnThemeToggle} onLogout={mockOnLogout} />
      );

      const themeButton = screen.getByRole("button", { name: /toggle theme/i });
      fireEvent.click(themeButton);

      expect(mockOnThemeToggle).toHaveBeenCalled();
    });

    it("calls onLogout when the logout button is clicked", () => {
      render(
        <SidebarFooter onThemeToggle={mockOnThemeToggle} onLogout={mockOnLogout} />
      );

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockOnLogout).toHaveBeenCalled();
    });
  });
});
