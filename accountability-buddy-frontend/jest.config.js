const nextJest = require("next/jest");

// Create a Next.js-specific Jest configuration
const createJestConfig = nextJest({
  dir: "./", // The root directory of your Next.js project
});

// Custom Jest configuration
const customJestConfig = {
  // Use Babel to transform JS, JSX, TS, TSX files
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios|some-other-module-to-transform)/)", // Add modules as needed
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  // Set up the test environment to use jsdom
  testEnvironment: "jest-environment-jsdom",

  // Files to set up the testing environment
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"], // Adjusted for consistency

  // Aliases to support module imports
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.+\\.module\\.css$": "identity-obj-proxy",
  },

  // Enable test coverage collection
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/index.js", // Exclude specific files from coverage
    "!src/reportWebVitals.js",
    "!src/**/*.d.ts", // Exclude TypeScript declaration files
  ],
  coverageDirectory: "<rootDir>/coverage", // Directory for coverage reports

  // Optional: Add snapshot serializers for libraries like Emotion
  snapshotSerializers: ["@emotion/jest/serializer"],

  // Custom Jest reporters
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports/junit",
        outputName: "jest-junit.xml",
      },
    ],
  ],

  // Thresholds for test coverage
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Watch ignore patterns
  watchPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/coverage/"],

  // Add extensions for TypeScript module resolution
  moduleDirectories: ["node_modules", "<rootDir>/src"],

  // Enhanced logging for debugging Jest configurations
  verbose: true,

  // Handle static assets for testing
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Mock CSS imports
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js", // Mock static files
  },
};

module.exports = createJestConfig(customJestConfig);
