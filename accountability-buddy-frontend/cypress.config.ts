const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000', // Use env variable or default
    setupNodeEvents(on, config) {
      // Handle test failures to capture screenshots
      on('after:spec', (spec, results) => {
        if (results && results.stats.failures > 0) {
          console.error(`Test failed in spec: ${spec.relative}`);
        }
      });

      // Add additional event listeners or plugins here if needed
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // Match standard E2E test folder structure
    supportFile: 'cypress/support/e2e.js', // Path to the support file
    video: process.env.CI === 'true', // Enable video recording only in CI
    screenshotsFolder: 'cypress/screenshots/[spec.name]', // Organized screenshots
    videosFolder: 'cypress/videos', // Folder for videos
    viewportWidth: 1280, // Default viewport width
    viewportHeight: 720, // Default viewport height
    retries: {
      runMode: 2, // Retries for failed tests in CI
      openMode: 0, // No retries in interactive mode
    },
    env: {
      apiUrl: process.env.API_URL || 'http://localhost:3000/api', // Example API URL
    },
  },

  component: {
    specPattern: 'cypress/component/**/*.{js,jsx,ts,tsx}', // Component test folder
    devServer: {
      framework: process.env.COMPONENT_FRAMEWORK || 'next', // Dynamically set framework
      bundler: 'webpack',
    },
  },
});
