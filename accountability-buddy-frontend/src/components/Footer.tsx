import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Import the CSS file for footer styling
import NewsletterSignup from "./NewsletterSignup"; // Importing the newsletter component

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <div className="container">
        <div className="leftSection">
          <p>&copy; {currentYear} Your Company Name. All rights reserved.</p>
        </div>

        <div className="rightSection">
          {/* Newsletter Signup Form */}
          <NewsletterSignup />

          {/* Navigation Links */}
          <nav aria-label="Footer Navigation">
            <ul className="linkList">
              <li>
                <Link to="/terms-of-service" className="link" aria-label="Terms of Service">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="link" aria-label="Privacy Policy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="link" aria-label="Contact Us">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter"
                >
                  <i className="fab fa-twitter" aria-hidden="true"></i> Twitter
                </a>
              </li>
              {/* Add more social media links as needed */}
            </ul>
          </nav>

          {/* "Back to Top" Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="backToTopButton"
            aria-label="Scroll back to top"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
