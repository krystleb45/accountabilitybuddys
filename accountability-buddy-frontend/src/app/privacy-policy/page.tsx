import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Privacy Policy</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <section aria-labelledby="intro">
          <h2 id="intro" className="text-xl font-semibold text-gray-800 mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            We are committed to protecting your privacy. This page explains how
            we collect, use, and share your personal information when you use
            our services.
          </p>
        </section>

        <section aria-labelledby="data-collection">
          <h2 id="data-collection" className="text-xl font-semibold text-gray-800 mb-4">
            Data Collection
          </h2>
          <p className="text-gray-700 mb-4">
            We collect personal information that you provide directly to us,
            such as when you create an account, update your profile, or interact
            with our services. This includes your name, email address, and any
            other details you choose to share.
          </p>
        </section>

        <section aria-labelledby="data-usage">
          <h2 id="data-usage" className="text-xl font-semibold text-gray-800 mb-4">
            How We Use Your Data
          </h2>
          <p className="text-gray-700 mb-4">
            We use your personal information to provide, improve, and promote
            our services. This may include sending you updates, processing your
            requests, or personalizing your experience.
          </p>
        </section>

        <section aria-labelledby="third-parties">
          <h2 id="third-parties" className="text-xl font-semibold text-gray-800 mb-4">
            Sharing with Third Parties
          </h2>
          <p className="text-gray-700 mb-4">
            We may share your information with trusted third-party service
            providers to help us deliver our services, comply with legal
            obligations, or enforce our terms of service.
          </p>
        </section>

        <section aria-labelledby="contact-info">
          <h2 id="contact-info" className="text-xl font-semibold text-gray-800 mb-4">
            Contact Information
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:support@accountabilitybuddy.com"
              className="text-blue-600 hover:underline"
            >
              support@accountabilitybuddy.com
            </a>
            .
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
