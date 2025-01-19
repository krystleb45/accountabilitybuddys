module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Ensures Node.js globals (e.g., `module`) are recognized
  },
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended"
  ],
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser for TypeScript
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enables JSX parsing
    },
    ecmaVersion: 12,
    sourceType: "module", // Allows `import` and `export`
  },
  plugins: [
    "react", // React-specific linting rules
    "@typescript-eslint", // TypeScript linting rules
    "jsx-a11y", // Accessibility linting rules
    "prettier", // Integrates Prettier
  ],
  rules: {
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
    "react/prop-types": "off", // TypeScript handles prop types
    "@typescript-eslint/no-unused-vars": ["warn"], // Warns for unused variables
    "prettier/prettier": ["warn"], // Warns for Prettier formatting issues
    "jsx-a11y/anchor-is-valid": [
      "warn",
      {
        aspects: ["invalidHref", "preferButton"],
      },
    ], // Warns for invalid anchor tags
  },
  settings: {
    react: {
      version: "detect", // Automatically detects the React version
    },
  },
};
