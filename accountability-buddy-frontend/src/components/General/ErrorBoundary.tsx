import React, { ReactNode } from 'react';

// Define types for props and state
interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string; // Optional custom fallback message
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  // Log error details
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Add external logging service logic here (e.g., Sentry, LogRocket)
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallbackMessage } = this.props;

    if (hasError) {
      // Render fallback UI
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
          }}
          data-testid="error-boundary"
        >
          <h1>{fallbackMessage || 'Something went wrong.'}</h1>
          <p>We are working to fix the issue. Please try again later.</p>
          {/* Optional detailed error info for debugging */}
          {process.env.NODE_ENV === 'development' && error && errorInfo && (
            <details style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
              <summary>Error Details</summary>
              <p>{error.toString()}</p>
              <p>{errorInfo.componentStack}</p>
            </details>
          )}
        </div>
      );
    }

    // Render the child components when no error
    return children;
  }
}

export default ErrorBoundary;
