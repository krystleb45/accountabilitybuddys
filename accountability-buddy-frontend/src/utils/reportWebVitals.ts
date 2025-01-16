import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from "web-vitals";

type ReportMetric = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportMetric): void => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

// Example usage for development
if (process.env.NODE_ENV === "development") {
  reportWebVitals(console.log); // Log metrics to the console in development
}

export default reportWebVitals;
