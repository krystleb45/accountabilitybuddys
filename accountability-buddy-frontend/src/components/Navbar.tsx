import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/authService"; // Ensure `authService` is the default export
import "./Navbar.css";

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
      if (authService.getToken()) { // Use `authService` to access the methods
        try {
          const userInfo = await authService.getUserInfo();
          setUser(userInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    authService.removeToken(); // Use `authService` to handle token removal
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-brand">
        <NavLink to="/">BrandName</NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
      </ul>
      <div className="navbar-user">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
