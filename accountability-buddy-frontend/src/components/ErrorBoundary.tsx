import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Catch errors in any components below and re-render with an error message
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  // Log error information to an external logging service or console
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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
          style={{ padding: "20px", textAlign: "center" }}
        >
          <h1>Something went wrong.</h1>
          <p>
            We're sorry, an error occurred. Please try refreshing the page or
            contact support.
          </p>
          {/* Show error details if in development mode */}
          {process.env.NODE_ENV === "development" && (
            <details style={{ whiteSpace: "pre-wrap" }}>
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

export default ErrorBoundary;
