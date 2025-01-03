import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicyPage = () => {
  const effectiveDate = 'January 1, 2024'; // Set an explicit effective date

  return (
    <div className="privacy-policy-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* SEO enhancements */}
      <Helmet>
        <title>Privacy Policy - Accountability Buddy</title>
        <meta
          name="description"
          content="Learn about how Accountability Buddy collects, uses, and protects your personal information."
        />
      </Helmet>

      <h1>Privacy Policy</h1>
      <p>Effective Date: {effectiveDate}</p>

      {/* Table of Contents */}
      <nav aria-label="Table of Contents">
        <ol>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#information-we-collect">Information We Collect</a></li>
          <li><a href="#how-we-use-your-information">How We Use Your Information</a></li>
          <li><a href="#data-security">Data Security</a></li>
          <li><a href="#user-rights">Your Rights</a></li>
          <li><a href="#contact-us">Contact Us</a></li>
        </ol>
      </nav>

      {/* Privacy Policy Sections */}
      <section id="introduction">
        <h2>Introduction</h2>
        <p>
          At Accountability Buddy, we are committed to protecting your privacy. This policy explains how we collect, use, and share information about you when you use our services.
        </p>
      </section>

      <section id="information-we-collect">
        <h2>Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you create an account, update your profile, or interact with our support team. We also collect information about your use of our services.
        </p>
      </section>

      <section id="how-we-use-your-information">
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to provide, maintain, and improve our services, communicate with you, and protect the security of our platform.
        </p>
      </section>

      <section id="data-security">
        <h2>Data Security</h2>
        <p>
          We implement security measures to protect your information. However, please be aware that no data transmission over the internet is 100% secure.
        </p>
      </section>

      <section id="user-rights">
        <h2>Your Rights</h2>
        <p>
          You have rights regarding your personal information, including the right to access, correct, or delete the information we hold about you.
        </p>
      </section>

      <section id="contact-us">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us at support@accountabilitybuddy.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
