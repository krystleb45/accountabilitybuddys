import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken, removeToken, getUserInfo } from '../services/authService';
import './Navbar.css';

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = getToken();

  // Fetch user info when token is present
  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        const userInfo = await getUserInfo(); // Fetch user info from authService
        setUser(userInfo);
      };
      fetchUserInfo();
    }
  }, [token]);

  const handleLogout = async () => {
    setLoading(true);
    await removeToken(); // Remove token from local storage or cookies
    setUser(null); // Reset user state
    setLoading(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link" aria-label="Accountability Buddy Home">
          <h2>Accountability Buddy</h2>
        </NavLink>
      </div>

      <ul className="navbar-links" aria-live="polite">
        <li>
          <NavLink 
            to="/" 
            exact 
            activeClassName="active" 
            aria-current={window.location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </NavLink>
        </li>
        {token ? (
          <>
            <li>
              <NavLink 
                to="/profile" 
                activeClassName="active" 
                aria-current={window.location.pathname === '/profile' ? 'page' : undefined}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="user-avatar"
                    aria-label="User Avatar"
                  />
                ) : (
                  <span className="user-placeholder">P</span> // Placeholder if no avatar
                )}
                {user?.name || 'Profile'}
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="logout-button"
                aria-label="Logout"
                disabled={loading}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink 
                to="/login" 
                activeClassName="active" 
                aria-current={window.location.pathname === '/login' ? 'page' : undefined}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/signup" 
                activeClassName="active" 
                aria-current={window.location.pathname === '/signup' ? 'page' : undefined}
              >
                Signup
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
