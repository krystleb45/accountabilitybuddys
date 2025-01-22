import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  isAuthenticated: boolean; // Indicates if the user is authenticated
  onLogout: () => void; // Callback for logging out
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="header" role="banner" aria-label="Main navigation">
      <div className="logo">
        <Link to="/" aria-label="Home">
          <img
            src="/logo.png"
            alt="Accountability Buddy Logo"
            className="logo-image"
          />
        </Link>
      </div>

      <nav className="nav">
        <ul className="nav-list">
          {/* Main navigation links */}
          {[
            { path: "/", label: "Home" },
            { path: "/goals", label: "Goals" },
            { path: "/collaborations", label: "Collaborations" },
            { path: "/profile", label: "Profile" },
          ].map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? "active" : "inactive")}
                aria-label={label}
              >
                {label}
              </NavLink>
            </li>
          ))}

          {/* Conditional rendering for login/logout */}
          {isAuthenticated ? (
            <li>
              <button
                onClick={onLogout}
                className="logout-button"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "inactive")}
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
