import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Report web vital metrics to a specified callback.
 *
 * @param onPerfEntry - Callback function to handle performance metrics.
 */
const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry); // Cumulative Layout Shift
    onFID(onPerfEntry); // First Input Delay
    onFCP(onPerfEntry); // First Contentful Paint
    onLCP(onPerfEntry); // Largest Contentful Paint
    onTTFB(onPerfEntry); // Time to First Byte
  } else {
    console.warn('Invalid onPerfEntry callback provided.');
  }
};

export default reportWebVitals;
