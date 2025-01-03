import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css'; // Optional CSS for styling

const Sidebar = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <aside className="sidebar" role="navigation" aria-label="Sidebar Navigation">
      <ul className="sidebar-list">
        <li>
          <NavLink to="/" exact activeClassName="active" aria-label="Dashboard">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/goals" activeClassName="active" aria-label="Goals">
            Goals
          </NavLink>
        </li>
        <li>
          <NavLink to="/collaborations" activeClassName="active" aria-label="Collaborations">
            Collaborations
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeClassName="active" aria-label="Profile">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" activeClassName="active" aria-label="Settings">
            Settings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

Sidebar.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default Sidebar;
