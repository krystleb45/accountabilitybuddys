import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from 'src/services/authService';
import NavbarDropdown from './NavbarDropdown';
import NavbarItems from './NavbarItem';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import './Navbar.css';

interface User {
  id: string;
  name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch user info if a token is present
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userInfo = await authService.getUserInfo();
          setUser(userInfo);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    authService.removeToken();
    setUser(null);
    navigate('/login');
  };

  // Navigation items for the main navbar
  const navItems = [
    { label: 'Home', to: '/', exact: true, icon: <FaHome /> },
    { label: 'Profile', to: '/profile', icon: <FaUser /> },
    { label: 'Settings', to: '/settings', icon: <FaCog /> },
  ];

  // Dropdown items for user-specific actions
  const dropdownItems = [
    { label: 'Profile', onClick: () => navigate('/profile') },
    { label: 'Settings', onClick: () => navigate('/settings') },
    { label: 'Logout', onClick: handleLogout },
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* Brand */}
      <div className="navbar-brand">
        <NavLink to="/" aria-label="Go to Home">
          BrandName
        </NavLink>
      </div>

      {/* Navbar Items */}
      <NavbarItems items={navItems} />

      {/* User Section */}
      <div className="navbar-user">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : user ? (
          <>
            <span className="user-greeting">Welcome, {user.name}!</span>
            <NavbarDropdown title="Account" items={dropdownItems} />
          </>
        ) : (
          <NavLink to="/login" className="login-link" aria-label="Login">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
