// Test Configuration

interface TestConfig {
    testEnvironment: "development" | "staging" | "production";
    apiBaseUrl: string;
    mockDataEnabled: boolean;
    timeout: number; // Timeout for test requests in milliseconds
    logLevel: "info" | "warn" | "error" | "debug";
  
    // Methods
    setEnvironment: (env: "development" | "staging" | "production") => void;
    enableMockData: (enable: boolean) => void;
    setLogLevel: (level: "info" | "warn" | "error" | "debug") => void;
  }
  
  const testConfig: TestConfig = {
    // Default Test Configuration
    testEnvironment: (process.env.TEST_ENV as "development" | "staging" | "production") || "development",
    apiBaseUrl:
      process.env.TEST_API_BASE_URL || "http://localhost:5000", // Default API URL
    mockDataEnabled: process.env.ENABLE_MOCK_DATA === "true", // Enable/Disable mock data
    timeout: parseInt(process.env.TEST_REQUEST_TIMEOUT || "10000", 10), // Default timeout 10 seconds
    logLevel: (process.env.TEST_LOG_LEVEL as "info" | "warn" | "error" | "debug") || "info",
  
    // Set the current environment
    setEnvironment: function (env: "development" | "staging" | "production") {
      this.testEnvironment = env;
      console.log(`Test environment set to: ${env}`);
    },
  
    // Enable or disable mock data
    enableMockData: function (enable: boolean) {
      this.mockDataEnabled = enable;
      console.log(`Mock data ${enable ? "enabled" : "disabled"}`);
    },
  
    // Set the logging level
    setLogLevel: function (level: "info" | "warn" | "error" | "debug") {
      this.logLevel = level;
      console.log(`Log level set to: ${level}`);
    },
  };
  
  // Example Usage:
  // testConfig.setEnvironment("staging");
  // testConfig.enableMockData(true);
  // testConfig.setLogLevel("debug");
  
  export default testConfig;
  