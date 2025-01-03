import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Backend-specific file types
    ignores: [
      "dist/",
      "build/",
      "node_modules/",
      "coverage/",
      "public/",
      "static/",
      "*.d.ts",
      "*.js",
      "*.mjs",
      "*.cjs",
      ".eslintrc.js",
      "jest.config.js",
      ".eslintrc.*",
    ], // Use this to specify ignored files and directories
    languageOptions: {
      globals: globals.node, // Node.js globals
      parser: typescriptParser, // Import parser as an object
      parserOptions: {
        ecmaVersion: "latest", // Latest ECMAScript features
        sourceType: "module", // Module-based project
        project: "./tsconfig.json", // Use your TypeScript configuration
        tsconfigRootDir: process.cwd(), // Ensure the correct resolution of tsconfig.json
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint, // Define plugin as an object
    },
    rules: {
      // Error prevention
      "no-unused-vars": "off", // Disable base rule
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // TS-specific unused vars rule
      "no-console": "warn", // Warn about console statements

      // Stylistic preferences
      quotes: ["error", "double"], // Enforce double quotes
      semi: ["error", "always"], // Enforce semicolons
      indent: ["error", 2], // Enforce 2-space indentation

      // TypeScript-specific rules
      "@typescript-eslint/explicit-function-return-type": "warn", // Warn if return type is not specified
    },
  },
];
