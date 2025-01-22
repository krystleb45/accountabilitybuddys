import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.module.css"; // Use CSS module for scoped styling

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
        <li className="sidebar-item">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            aria-label="Dashboard"
          >
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/goals"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            aria-label="Goals"
          >
            Goals
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/collaborations"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            aria-label="Collaborations"
          >
            Collaborations
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            aria-label="Profile"
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
