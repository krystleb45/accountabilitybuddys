import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Target file extensions
    ignores: [
      "dist/",
      "build/",
      "node_modules/",
      "coverage/",
      "public/",
      "static/",
      "*.d.ts",
      "*.min.js",
      "*.bundle.js",
      "*.mjs",
      "*.cjs",
      ".eslintrc.js",
      "jest.config.js",
      ".eslintrc.*",
    ], // Ignore build artifacts, configs, and unnecessary files
    languageOptions: {
      globals: globals.node, // Node.js globals
      parser: typescriptParser, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: "latest", // Latest ECMAScript features
        sourceType: "module", // Enable ECMAScript modules
        project: "./tsconfig.json", // TypeScript configuration file
        tsconfigRootDir: process.cwd(), // Correct resolution for tsconfig.json
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint, // TypeScript-specific rules
    },
    rules: {
      // General JavaScript rules
      "no-console": ["warn", { allow: ["warn", "error"] }], // Warn about console, except warn/error
      "quotes": ["error", "double", { avoidEscape: true }], // Enforce double quotes, allow escaping
      "semi": ["error", "always"], // Enforce semicolons
      "indent": ["error", 2, { SwitchCase: 1 }], // Enforce 2-space indentation, indent case statements
      "comma-dangle": ["error", "always-multiline"], // Require trailing commas in multiline

      // TypeScript-specific rules
      "no-unused-vars": "off", // Disable base rule
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }, // Ignore unused variables prefixed with _
      ],
      "@typescript-eslint/explicit-function-return-type": "warn", // Warn on missing function return types
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" }, // Enforce consistent use of type imports
      ],
      "@typescript-eslint/no-inferrable-types": "warn", // Warn on explicit types that can be inferred
      "@typescript-eslint/no-floating-promises": "error", // Enforce handling of promises
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        { "ts-ignore": "allow-with-description" }, // Allow ts-ignore with descriptions
      ],

      // Prettier-style rules
      "object-curly-spacing": ["error", "always"], // Require spaces inside object braces
      "array-bracket-spacing": ["error", "never"], // Disallow spaces inside array brackets
    },
  },
];
