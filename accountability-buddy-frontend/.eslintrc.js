module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Ensures Node.js globals (e.g., `module`) are recognized
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals', // Recommended ESLint rules for Next.js
    'plugin:react/recommended', // React-specific linting rules
    'plugin:@typescript-eslint/recommended', // TypeScript-specific linting rules
    'plugin:jsx-a11y/recommended', // Accessibility linting rules
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
    'plugin:storybook/recommended', // Recommended rules for Storybook
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enables JSX parsing
    },
    ecmaVersion: 2021,
    sourceType: 'module', // Allows `import` and `export`
  },
  plugins: [
    'react', // React-specific linting rules
    '@typescript-eslint', // TypeScript-specific linting rules
    'jsx-a11y', // Accessibility linting rules
    'prettier', // Integrates Prettier
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // TypeScript handles prop types
    '@typescript-eslint/no-unused-vars': ['warn'], // Warns for unused variables
    '@typescript-eslint/explicit-function-return-type': 'off', // No need to enforce explicit return types
    '@typescript-eslint/no-explicit-any': 'warn', // Discourages the use of `any`
    '@typescript-eslint/consistent-type-imports': 'warn', // Enforces consistent type imports
    'react-hooks/rules-of-hooks': 'error', // Ensures hooks are used correctly
    'react-hooks/exhaustive-deps': 'warn', // Warns for missing dependencies in hooks
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto', // Avoids line ending issues
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'warn', // Ensures clickable elements are accessible
    'jsx-a11y/no-static-element-interactions': 'warn', // Warns for interactive elements without roles
  },
  settings: {
    react: {
      version: 'detect', // Automatically detects the React version
    },
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
      env: {
        jest: true, // Enables Jest globals for testing files
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off', // Allows unused variables in test files
      },
    },
  ],
};
