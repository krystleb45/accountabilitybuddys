import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner'; // Ensure the correct path to LoadingSpinner

interface LazyRouteLoaderProps {
  component: React.LazyExoticComponent<React.FC>;
}

/**
 * LazyRouteLoader Component
 *
 * This component wraps lazy-loaded components with a fallback loader.
 *
 * @param {LazyRouteLoaderProps} props - The props containing the lazy-loaded component.
 * @returns {JSX.Element} - The component wrapped with a Suspense fallback.
 */
const LazyRouteLoader: React.FC<LazyRouteLoaderProps> = ({
  component: Component,
}) => {
  return (
    <Suspense fallback={<LoadingSpinner size={50} color="#007bff" overlay />}>
      <Component />
    </Suspense>
  );
};

export default LazyRouteLoader;
