const reportWebVitals = (onPerfEntry = () => {}) => {
  if (onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        try {
          // Measure Cumulative Layout Shift (CLS)
          getCLS(onPerfEntry);
          // Measure First Input Delay (FID)
          getFID(onPerfEntry);
          // Measure First Contentful Paint (FCP)
          getFCP(onPerfEntry);
          // Measure Largest Contentful Paint (LCP)
          getLCP(onPerfEntry);
          // Measure Time to First Byte (TTFB)
          getTTFB(onPerfEntry);
        } catch (metricError) {
          console.error('Error capturing web vitals:', metricError);
        }
      })
      .catch((importError) => {
        console.error('Error importing web-vitals module:', importError);
      });
  }
};

// Example usage for development
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log); // Log metrics to console in development
}

export default reportWebVitals;
