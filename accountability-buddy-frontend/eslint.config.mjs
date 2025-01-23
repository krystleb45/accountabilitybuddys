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
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals like `process` and `__dirname`
      },
      parser: tsParser, // Use TypeScript parser for type safety
    },
    plugins: {
      '@typescript-eslint': typescript, // TypeScript plugin for linting
      react, // React-specific rules
      'jsx-a11y': jsxA11y, // Accessibility rules
      prettier, // Prettier integration for formatting
    },
    rules: {
      ...js.configs.recommended.rules, // JavaScript recommendations
      ...typescript.configs.recommended.rules, // TypeScript recommendations
      ...react.configs.recommended.rules, // React recommendations
      'prettier/prettier': 'warn', // Format issues as warnings
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true, // Avoid forcing return types on inline functions
          allowTypedFunctionExpressions: true, // Allow already-typed functions
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Ignore unused arguments prefixed with '_'
          varsIgnorePattern: '^_', // Ignore unused variables prefixed with '_'
        },
      ],
      'jsx-a11y/anchor-is-valid': [
        'warn',
        {
          aspects: ['invalidHref', 'preferButton'], // Accessibility for links
        },
      ],
      'no-undef': 'off', // Disable 'no-undef' since TypeScript handles it
      'linebreak-style': ['error', 'unix'], // Enforce consistent line endings (LF)
      'react/react-in-jsx-scope': 'off', // Not needed in projects with React 17+
      'react/prop-types': 'off', // Disable prop-types since TypeScript is used
    },
  },
  {
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.node, // Add Node.js globals for testing
    },
    rules: {
      'no-undef': 'off', // Allow Jest globals like `describe` and `it`
      '@typescript-eslint/no-explicit-any': 'off', // Allow `any` in tests for flexibility
    },
  },
];
