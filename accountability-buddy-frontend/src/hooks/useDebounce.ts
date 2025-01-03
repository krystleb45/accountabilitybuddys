import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value.
 *
 * This hook delays updating the value until after the specified delay
 * period has passed since the last change.
 *
 * @template T - The type of the debounced value.
 * @param value - The value to be debounced.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value.
 */
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
