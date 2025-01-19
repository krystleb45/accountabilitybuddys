const nextJest = require("next/jest");

// Debugging: Add a log to confirm Jest config is being loaded
//console.log('Jest config loaded');

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
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.tsx"], // Updated path to setupTests.tsx

  // Aliases to support module imports
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    '^.+\\.module\\.css$': 'identity-obj-proxy',
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

  // Custom Jest reporters (optional)
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

  // Thresholds for test coverage (optional)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Watch ignore patterns (optional)
  watchPathIgnorePatterns: ["<rootDir>/node_modules/"],

  // Add extensions for TypeScript module resolution (optional)
  moduleDirectories: ["node_modules", "<rootDir>/src"],
};

module.exports = createJestConfig(customJestConfig);
