import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css'; // Optional CSS for styling

const Header = ({ isAuthenticated, onLogout }) => {
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
            <NavLink to="/" exact activeClassName="active" aria-label="Home">
              Home
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
          {isAuthenticated ? (
            <li>
              <button onClick={onLogout} aria-label="Logout">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/login" activeClassName="active" aria-label="Login">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
