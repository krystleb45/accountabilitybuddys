import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "../../src/routes/PrivateRoute";
import AuthContext from "../../src/context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock useNavigate to simulate redirection
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("PrivateRoute Component", () => {
  const mockNavigate = jest.fn();

  // Mock AuthContextType structure
  const mockAuthContextValueAuthenticated = {
    authToken: "mockAuthToken",
    isAuthenticated: true,
    loading: false,
    user: { id: "1", name: "Test User" },
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockAuthContextValueUnauthenticated = {
    authToken: null,
    isAuthenticated: false,
    loading: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockAuthContextValueLoading = {
    ...mockAuthContextValueUnauthenticated,
    loading: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test("renders correctly when user is authenticated", () => {
    render(
      <AuthContext.Provider value={mockAuthContextValueAuthenticated}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} isAuthenticated={false} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check that the protected content is rendered
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  test("redirects to login when user is not authenticated", () => {
    render(
      <AuthContext.Provider value={mockAuthContextValueUnauthenticated}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} isAuthenticated={false} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check that navigation occurs to the login page
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  test("shows loading spinner when loading", () => {
    render(
      <AuthContext.Provider value={mockAuthContextValueLoading}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} isAuthenticated={false} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check that the loading spinner is displayed
    expect(screen.getByLabelText(/loading, please wait/i)).toBeInTheDocument();
  });
});