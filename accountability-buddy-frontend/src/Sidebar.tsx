import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <aside className="sidebar" role="navigation" aria-label="Sidebar Navigation">
      <ul className="sidebar-list">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Dashboard"
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/goals"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Goals"
          >
            Goals
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collaborations"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Collaborations"
          >
            Collaborations
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Profile"
          >
            Profile
          </NavLink>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </aside>
  );
};

export default Sidebar;
