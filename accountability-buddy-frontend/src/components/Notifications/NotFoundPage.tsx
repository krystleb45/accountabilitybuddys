import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css"; // Optional: Create a CSS file for additional styling if needed.

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="back-home-link">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
