import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css"; // Optional CSS for styling

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="header" role="banner" aria-label="Main navigation">
      <div className="logo">
        <Link to="/" aria-label="Home">
          <img src="/logo.png" alt="Accountability Buddy Logo" />
        </Link>
      </div>

      <nav className="nav">
        <ul className="nav-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              aria-label="Home"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/goals"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              aria-label="Goals"
            >
              Goals
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collaborations"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              aria-label="Collaborations"
            >
              Collaborations
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : undefined)}
              aria-label="Profile"
            >
              Profile
            </NavLink>
          </li>
          {isAuthenticated ? (
            <li>
              <button
                onClick={onLogout}
                aria-label="Logout"
                className="logout-button"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : undefined)}
                aria-label="Login"
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
