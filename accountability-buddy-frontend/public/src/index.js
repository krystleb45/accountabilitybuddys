import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 API for rendering
import App from './App'; // Main App component
import './index.css'; // Global CSS styles
import { HelmetProvider } from 'react-helmet-async'; // Helmet for managing document head
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Service worker setup
import { ThemeContextProvider } from './context/ThemeContext'; // Centralized theme context
import { LanguageContextProvider } from './context/LanguageContext'; // Centralized language context

// Functional Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>An unexpected error occurred. Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Initialize the root rendering element for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Centralized App Wrapper for Context Providers
const AppWrapper = () => (
  <React.StrictMode>
    <HelmetProvider>
      <ThemeContextProvider>
        <LanguageContextProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </LanguageContextProvider>
      </ThemeContextProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Render the App
root.render(<AppWrapper />);

// Register the service worker for offline support with enhanced error handling
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (window.confirm('A new version is available. Reload to update?')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
  onSuccess: () => {
    console.log('Service worker registered successfully.');
  },
  onError: (error) => {
    console.error('Service worker registration failed:', error);
  },
});
