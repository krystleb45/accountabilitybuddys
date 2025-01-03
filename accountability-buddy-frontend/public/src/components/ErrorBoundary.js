import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Catch errors in any components below and re-render with an error message
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  // Log error information to an external logging service or console
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Log the error to an external service or console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a custom fallback UI
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{ padding: '20px', textAlign: 'center' }}
        >
          <h1>Something went wrong.</h1>
          <p>
            We're sorry, an error occurred. Please try refreshing the page or contact support.
          </p>
          {/* Show error details if in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    // Render children if no error occurred
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
