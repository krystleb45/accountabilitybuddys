import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import NewsletterSignup from "./NewsletterSignup";

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
          <ul className="linkList">
            <li>
              <Link
                to="/terms-of-service"
                className="link"
                aria-label="Terms of Service"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="link"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="link"
                aria-label="Contact Us"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
