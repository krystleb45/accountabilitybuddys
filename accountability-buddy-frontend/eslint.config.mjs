import globals from 'globals';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser, // Use the TypeScript parser
    },
    plugins: {
      typescript,
      react,
      jsxA11y, // Accessibility linting
      prettier, // Prettier formatting
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'prettier/prettier': 'warn', // Prettier formatting issues
      '@typescript-eslint/explicit-function-return-type': 'warn', // Enforce return types
      '@typescript-eslint/no-unused-vars': 'warn', // Warn for unused variables
      'jsx-a11y/anchor-is-valid': 'warn', // Accessibility for anchors
    },
  },
  {
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.node, // Include Node.js globals for tests
    },
    rules: {
      'no-undef': 'off', // Allow Jest globals like `describe` and `it`
    },
  },
];
