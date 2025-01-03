import React from 'react';
import { Helmet } from 'react-helmet';

const TermsOfServicePage = () => {
  const effectiveDate = 'January 1, 2024'; // Set a clear effective date

  return (
    <div className="terms-of-service-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* SEO enhancements */}
      <Helmet>
        <title>Terms of Service - Accountability Buddy</title>
        <meta
          name="description"
          content="Understand the terms and conditions of using Accountability Buddy's services."
        />
      </Helmet>

      <h1>Terms of Service</h1>
      <p>Effective Date: {effectiveDate}</p>

      {/* Table of Contents */}
      <nav aria-label="Table of Contents">
        <ol>
          <li><a href="#acceptance-of-terms">Acceptance of Terms</a></li>
          <li><a href="#changes-to-terms">Changes to Terms</a></li>
          <li><a href="#user-responsibilities">User Responsibilities</a></li>
          <li><a href="#account-termination">Account Termination</a></li>
          <li><a href="#limitation-of-liability">Limitation of Liability</a></li>
          <li><a href="#governing-law">Governing Law</a></li>
          <li><a href="#contact-us">Contact Us</a></li>
        </ol>
      </nav>

      {/* Terms of Service Sections */}
      <section id="acceptance-of-terms">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using the Accountability Buddy platform, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section id="changes-to-terms">
        <h2>2. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. When we do, we will post the revised terms on this page 
          and update the "Effective Date" above. It is your responsibility to review the terms regularly.
        </p>
      </section>

      <section id="user-responsibilities">
        <h2>3. User Responsibilities</h2>
        <p>
          You are responsible for your use of the platform, including compliance with applicable laws, 
          rules, and regulations. You must not misuse our services or help others do so.
        </p>
      </section>

      <section id="account-termination">
        <h2>4. Account Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account if you violate any of these terms 
          or engage in any unlawful or prohibited behavior.
        </p>
      </section>

      <section id="limitation-of-liability">
        <h2>5. Limitation of Liability</h2>
        <p>
          Accountability Buddy is not liable for any indirect, incidental, or consequential damages 
          arising from your use of the platform.
        </p>
      </section>

      <section id="governing-law">
        <h2>6. Governing Law</h2>
        <p>
          These terms are governed by the laws of your jurisdiction, and any disputes arising out of 
          or relating to these terms will be resolved under the local laws.
        </p>
      </section>

      <section id="contact-us">
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at support@accountabilitybuddy.com.
        </p>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
