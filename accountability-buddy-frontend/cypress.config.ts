const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Ensure this matches your local development server URL
    setupNodeEvents(on, config) {
      // Example: Handle test failures to capture screenshots
      on("after:spec", (spec, results) => {
        if (results && results.stats.failures > 0) {
          console.error(`Test failed in spec: ${spec.relative}`);
        }
      });

      // Add additional event listeners or plugins here if needed
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}", // Updated to match standard e2e test folder structure
    supportFile: "cypress/support/e2e.js", // Path to the support file
    video: true, // Enable video recording of test runs
    screenshotsFolder: "cypress/screenshots", // Folder for screenshots
    videosFolder: "cypress/videos", // Folder for videos
    viewportWidth: 1280, // Default viewport width for tests
    viewportHeight: 720, // Default viewport height for tests
    retries: {
      runMode: 2, // Retries for failed tests in CI mode
      openMode: 0, // No retries in interactive mode
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
