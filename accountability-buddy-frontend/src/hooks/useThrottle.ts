import { useEffect, useRef } from "react";

/**
 * Custom hook for throttling a function.
 *
 * This hook ensures that the provided function is only called at most once
 * every specified time interval.
 *
 * @param callback - The function to throttle.
 * @param delay - The time interval (in milliseconds) for throttling.
 * @returns A throttled version of the provided function.
 */
const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const lastRan = useRef<number>(Date.now()); // Track the last time the callback was run
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // Store the timeout ID

  const throttledFunction = (...args: Parameters<T>) => {
    const now = Date.now();
    // If the current time minus the last run time exceeds the delay
    if (now - lastRan.current >= delay) {
      callback(...args); // Call the provided callback
      lastRan.current = now; // Update last run time
    } else {
      // Clear the existing timer if it's running
      if (timer.current) clearTimeout(timer.current);

      // Set a new timer to call the callback after the remaining time
      timer.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now(); // Update last run time
      }, delay - (now - lastRan.current));
    }
  };

  // Cleanup on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current); // Clear the timer on cleanup
    };
  }, []);

  return throttledFunction;
};

export default useThrottle;
