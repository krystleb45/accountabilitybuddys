import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css"; // Import CSS module for styling
import { getCurrentYear, generateFooterLinks } from "./FooterUtils";
import NewsletterSignup from "src/components/Forms/NewsletterSignup"; // Importing the newsletter component

const Footer: React.FC = () => {
  const currentYear = getCurrentYear(); // Dynamically fetch current year
  const footerLinks = generateFooterLinks(); // Generate footer links dynamically

  return (
    <footer className={styles["footer-container"]} role="contentinfo" aria-label="Footer">
      <div className={styles["container"]}>
        {/* Left Section: Copyright */}
        <div className={styles["left-section"]}>
          <p>&copy; {currentYear} Accountability Buddy. All rights reserved.</p>
        </div>

        {/* Right Section: Links, Newsletter, and Back to Top */}
        <div className={styles["right-section"]}>
          {/* Newsletter Signup Form */}
          <NewsletterSignup />

          {/* Navigation Links */}
          <nav aria-label="Footer Navigation">
            <ul className={styles["footer-links"]}>
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.url} className={styles["link"]} aria-label={link.name}>
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter"
                  className={styles["social-link"]}
                >
                  <i className="fab fa-twitter" aria-hidden="true"></i> Twitter
                </a>
              </li>
            </ul>
          </nav>

          {/* "Back to Top" Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={styles["back-to-top-button"]}
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
