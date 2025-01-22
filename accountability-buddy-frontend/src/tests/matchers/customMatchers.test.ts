// src/types/tests/matchers/customMatchers.ts

import { MatcherFunction } from 'expect';

/**
 * Custom matcher: `toBeWithinRange`
 * Verifies that a numeric value is within a specified range.
 *
 * @param received - The value being tested.
 * @param floor - The lower bound of the range.
 * @param ceiling - The upper bound of the range.
 */
const toBeWithinRange: MatcherFunction<[number, number]> = function (
  received,
  floor,
  ceiling
) {
  if (typeof received !== 'number') {
    throw new Error('Expected a number but received a different type.');
  }

  const pass = received >= floor && received <= ceiling;
  const message = pass
    ? () =>
        `Expected ${received} not to be within range [${floor}, ${ceiling}].`
    : () =>
        `Expected ${received} to be within range [${floor}, ${ceiling}].`;

  return { pass, message };
};

/**
 * Custom matcher: `toHaveClass`
 * Verifies that a DOM element has a specific class.
 *
 * @param received - The DOM element being tested.
 * @param expectedClass - The class name to check for.
 */
const toHaveClass: MatcherFunction<[string]> = function (
  received,
  expectedClass
) {
  if (!(received instanceof HTMLElement)) {
    throw new Error('Expected an HTMLElement but received a different type.');
  }

  const pass = received.classList.contains(expectedClass);
  const message = pass
    ? () =>
        `Expected element not to have class '${expectedClass}', but it does.`
    : () =>
        `Expected element to have class '${expectedClass}', but it does not.`;

  return { pass, message };
};

/**
 * Custom matcher: `toContainText`
 * Verifies that a DOM element contains specific text content.
 *
 * @param received - The DOM element being tested.
 * @param expectedText - The text content to check for.
 */
const toContainText: MatcherFunction<[string]> = function (
  received,
  expectedText
) {
  if (!(received instanceof HTMLElement)) {
    throw new Error('Expected an HTMLElement but received a different type.');
  }

  const pass = received.textContent?.includes(expectedText) ?? false;
  const message = pass
    ? () =>
        `Expected element not to contain text '${expectedText}', but it does.`
    : () =>
        `Expected element to contain text '${expectedText}', but it does not.`;

  return { pass, message };
};

// Register custom matchers with Jest
(expect as any).extend({
    toBeWithinRange,
    toHaveClass,
    toContainText,
  });

export {}; // Prevent "module has no exports" error.
