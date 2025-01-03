import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "./services/authService"; // Import the default authService
import "./Navbar.css";

interface User {
  id: string;
  name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const token = authService.getToken(); // Access getToken from the default export

  // Fetch user info when token is available
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (token) {
          const userInfo = await authService.getUserInfo(); // Access getUserInfo from the default export
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      authService.removeToken(); // Access removeToken from the default export
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Profile
          </NavLink>
        </li>
        {user ? (
          <li>
            <button onClick={handleLogout} disabled={loading}>
              {loading ? "Logging out..." : "Logout"}
            </button>
          </li>
        ) : (
          <li>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
