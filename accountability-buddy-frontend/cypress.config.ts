import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000', // Use env variable or default
    setupNodeEvents(on, _config) {
      on(
        'after:spec',
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult | null) => {
          if (results && results.stats.failures > 0) {
            console.error(`Test failed in spec: ${spec.relative}`);
          }
        }
      );
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // Match standard E2E test folder structure
    supportFile: 'cypress/support/e2e.ts', // Updated support file to TypeScript
    video: process.env.CI === 'true', // Enable video recording only in CI
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: process.env.API_URL || 'http://localhost:3000/api', // Example API URL
    },
  },

  component: {
    specPattern: 'cypress/component/**/*.{js,jsx,ts,tsx}', // Component test folder
    devServer: {
      framework:
        (process.env.COMPONENT_FRAMEWORK as
          | 'react'
          | 'vue'
          | 'next'
          | 'svelte'
          | 'angular') || 'next', // Ensure it's one of the allowed types or default to 'next'
      bundler: 'webpack',
    },
  },
});
